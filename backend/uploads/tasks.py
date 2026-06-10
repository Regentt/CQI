import logging
from celery import shared_task
import pdfplumber

from .models  import PDFUpload
from .parsers import CQIParser

logger = logging.getLogger(__name__)


@shared_task(bind=True, max_retries=3, default_retry_delay=60)
def process_upload(self, upload_id: str):
    
    try:
        upload = PDFUpload.objects.get(id=upload_id)
    except PDFUpload.DoesNotExist:
        logger.error(f"Upload not found: {upload_id}")
        return

    try:
        upload.status = PDFUpload.Status.PROCESSING
        upload.save(update_fields=['status'])

        extracted_text = ""
        all_tables     = []
 
        if upload.mime_type == 'application/pdf':
            with pdfplumber.open(upload.file.path) as pdf:
                upload.page_count = len(pdf.pages)
                for page in pdf.pages:
                    text = page.extract_text()
                    if text:
                        extracted_text += text + "\n"
                    for tbl in (page.extract_tables() or []):
                        if tbl:
                            all_tables.append(tbl)

        upload.extracted_text = extracted_text

        #   Parse structured CQI data  
        parser = CQIParser(upload.file_type)
        upload.parsed_data = parser.parse(extracted_text, all_tables)

        upload.status = PDFUpload.Status.DONE
        upload.save(update_fields=[
            'status', 'page_count',
            'extracted_text', 'parsed_data',
        ])
        logger.info(f"Processed: {upload.original_name}")

    except Exception as exc:
        logger.error(f"Failed {upload_id}: {exc}")
        upload.status    = PDFUpload.Status.FAILED
        upload.error_msg = str(exc)
        upload.save(update_fields=['status', 'error_msg'])
        raise self.retry(exc=exc)