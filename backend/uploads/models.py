import uuid
from django.db import models
from django.conf import settings


def upload_path(instance, filename): 
    return f"uploads/{instance.file_type}/{instance.id}/{filename}"

class PDFUpload(models.Model):

    class Status(models.TextChoices):
        PENDING    = 'pending',    'Pending'
        PROCESSING = 'processing', 'Processing'
        DONE       = 'done',       'Done'
        FAILED     = 'failed',     'Failed'

    class FileType(models.TextChoices):
        CO_ATTAINMENT        = 'co_attainment', 'CO Attainment'
        PO_ATTAINMENT        = 'po_attainment', 'PO Attainment'
        STUDENT_EVALUATION   = 'student_evaluation', 'Student Evaluation'
        INSTRUCTOR_FEEDBACK  = 'instructor_feedback', 'Instructor Feedback'
        TAVOLATION_SHEET     = 'tavolation_sheet', 'Tavolation Sheet'
        SUMMARY             = 'summary', 'Summary',
        OTHER               = 'other', 'Other'

    id            = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    uploaded_by   = models.ForeignKey(
                        settings.AUTH_USER_MODEL,
                        on_delete=models.SET_NULL,
                        null=True, blank=True,
                        related_name='uploads')

    #  File stored  
    file          = models.FileField(upload_to=upload_path)

    file_type     = models.CharField(max_length=30,
                                     choices=FileType.choices,
                                     default=FileType.OTHER)
    original_name = models.CharField(max_length=255)
    file_size     = models.PositiveBigIntegerField(help_text='bytes')
    mime_type     = models.CharField(max_length=100, blank=True)
    status        = models.CharField(max_length=20,
                                     choices=Status.choices,
                                     default=Status.PENDING,
                                     db_index=True)
    error_msg     = models.TextField(blank=True)

    extracted_text = models.TextField(blank=True)
    parsed_data    = models.JSONField(default=dict, blank=True)

    created_at    = models.DateTimeField(auto_now_add=True)
    updated_at    = models.DateTimeField(auto_now=True)

    class Meta:
        ordering            = ['-created_at']
        verbose_name        = 'PDF Upload'
        verbose_name_plural = 'PDF Uploads'

    def __str__(self):
        return f"{self.original_name} [{self.status}]"