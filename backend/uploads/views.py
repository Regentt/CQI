import logging
from rest_framework import views, status, permissions
from rest_framework.response import Response
from django.shortcuts import get_object_or_404

from .models      import PDFUpload
from .serializers import BulkUploadSerializer, PDFUploadSerializer

logger = logging.getLogger(__name__)


class UploadListView(views.APIView): 
    """
    POST /api/uploads/   → file upload
    GET  /api/uploads/   → list
    """
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        serializer = BulkUploadSerializer(data={
            'files':     request.FILES.getlist('files'),
            'file_type': request.data.get('file_type', 'other'), 
        })
        serializer.is_valid(raise_exception=True)
        vd = serializer.validated_data

        created = []
        for f in vd['files']:
            upload = PDFUpload.objects.create(
                uploaded_by   = request.user,
                file          = f,
                file_type     = vd['file_type'], 
                original_name = f.name,
                file_size     = f.size,
                mime_type     = f.content_type,
                status        = PDFUpload.Status.DONE,
            )
            created.append(upload)
            logger.info("Saved: %s → %s", upload.original_name, upload.file.path)

        out = PDFUploadSerializer(created, many=True, context={'request': request})
        return Response(out.data, status=status.HTTP_201_CREATED)

    def get(self, request):
        qs = PDFUpload.objects.filter(uploaded_by=request.user) 
        out = PDFUploadSerializer(qs, many=True, context={'request': request})
        return Response(out.data)


class UploadDetailView(views.APIView):
    """
    GET    /api/uploads/{id}/  → single file info
    DELETE /api/uploads/{id}/  → disk + DB both are delete
    """
    permission_classes = [permissions.IsAuthenticated]

    def _get(self, pk, user):
        return get_object_or_404(PDFUpload, pk=pk, uploaded_by=user)

    def get(self, request, pk):
        out = PDFUploadSerializer(self._get(pk, request.user),
                                  context={'request': request})
        return Response(out.data)

    def delete(self, request, pk):
        upload = self._get(pk, request.user)
        upload.file.delete(save=False)
        upload.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)