from rest_framework import serializers
from .models import PDFUpload

MAX_FILE_SIZE = 10 * 1024 * 1024   # 10 MB
MAX_FILES     = 7

ALLOWED_MIME = {
    'application/pdf',
    'image/jpeg', 'image/png', 'image/gif', 'image/webp',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
}


class PDFUploadSerializer(serializers.ModelSerializer):
    file_url = serializers.SerializerMethodField()
    uploaded_by_email = serializers.SerializerMethodField()

    class Meta:
        model = PDFUpload
        fields = [
            'id', 'original_name', 'file_type',
            'mime_type', 'file_size',
            'status', 'error_msg', 'parsed_data',
            'file_url', 'uploaded_by_email',
            'created_at', 'updated_at',
        ]

    def get_file_url(self, obj):
        req = self.context.get('request')
        if obj.file and req:
            return req.build_absolute_uri(obj.file.url)
        return None

    def get_uploaded_by_email(self, obj):
        return obj.uploaded_by.email if obj.uploaded_by else None

class BulkUploadSerializer(serializers.Serializer):
  
    files     = serializers.ListField(
                    child=serializers.FileField(),
                    max_length=MAX_FILES,
                    min_length=1)
    file_type = serializers.ChoiceField(choices=PDFUpload.FileType.choices)
 
    def validate_files(self, files):
        errors = []
        for f in files:
            if f.content_type not in ALLOWED_MIME:
                errors.append(f"'{f.name}': unsupported type ({f.content_type})")
            elif f.size > MAX_FILE_SIZE:
                errors.append(f"'{f.name}': exceeds 10 MB")
        if errors:
            raise serializers.ValidationError(errors)
        return files