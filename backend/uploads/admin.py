from django.contrib import admin
from django.utils.html import format_html
from .models import PDFUpload

@admin.register(PDFUpload)
class PDFUploadAdmin(admin.ModelAdmin):
    list_display = [
    'original_name',
    'file_type',
    'status_badge',
    'file_size_display',
    'uploaded_by',
    'created_at',
    ]
    list_filter    = ['status', 'file_type']
    search_fields  = ['original_name']
    readonly_fields= [
        'id', 'extracted_text', 'parsed_data',
        'created_at', 'updated_at',
    ]
    ordering       = ['-created_at']

    @admin.display(description='Status')
    def status_badge(self, obj):
        colors = {
            'pending':    '#6b7280',
            'processing': '#3b82f6',
            'done':       '#22c55e',
            'failed':     '#ef4444',
        }
        color = colors.get(obj.status, '#6b7280')
        return format_html(
            '<span style="color:{};font-weight:600">● {}</span>',
            color, obj.status
        )

    @admin.display(description='Size')
    def file_size_display(self, obj):
        if obj.file_size > 1_048_576:
            return f"{obj.file_size / 1_048_576:.1f} MB"
        return f"{obj.file_size / 1024:.0f} KB"