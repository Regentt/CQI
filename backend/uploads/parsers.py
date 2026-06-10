# import re


# class CQIParser: 

#     def __init__(self, file_type: str):
#         self.file_type = file_type

#     def parse(self, text: str, tables: list) -> dict:
#         handler = {
#             'co_attainment': self._course_file,
#             'po_attainment': self._grade_sheet,
#             'student_evaluation': self._clo_mapping,
#             'cqi_report': self._cqi_report,
#             'assessment': self._assessment,
#         }.get(self.file_type, self._generic)

#         return handler(text or "", tables or [])

  
#     def _course_file(self, text, tables):
#         return {
#             'course_code':  self._get(r'Course\s*Code[:\s]+([A-Z]{2,6}\d{3,4})', text),
#             'course_title': self._get(r'Course\s*Title[:\s]+(.+)', text),
#             'credit_hours': self._get(r'Credit\s*Hours?[:\s]+(\d+\.?\d*)', text),
#             'instructor':   self._get(r'Instructor[:\s]+(.+)', text),
#             'semester':     self._get(r'Semester[:\s]+(.+)', text),
#             'clos': re.findall(r'CLO\s*\d+[:\s]+(.+)', text),
#             'table_count': len(tables),
#         }

#     def _grade_sheet(self, text, tables):
#         dist = {}
#         grades = ['A+','A','A-','B+','B','B-','C+','C','D','F']
#         for tbl in tables:
#             for row in tbl:
#                 if row and len(row) >= 2 and row[0] in grades:
#                     try: dist[row[0]] = int(str(row[1]).strip())
#                     except: pass
#         total_students = self._get(r'Total\s*Students?[:\s]+(\d+)', text)
#         return {
#             'grade_distribution': dist,
#             'total_students': total_students,
#             'table_count': len(tables),
#         }

#     def _clo_mapping(self, text, tables):
#         mappings = []
#         for tbl in tables:
#             if not tbl: continue
#             headers = [str(h).strip() if h else '' for h in (tbl[0] or [])]
#             for row in tbl[1:]:
#                 if row:
#                     mappings.append({
#                         headers[i]: str(cell).strip() if cell else ''
#                         for i, cell in enumerate(row)
#                         if i < len(headers)
#                     })
#         return {'clo_plo_mappings': mappings, 'table_count': len(tables)}

#     def _cqi_report(self, text, tables):
#         return {
#             'attainment_targets': re.findall(r'\d+\.?\d*\s*%', text),
#             'improvement_areas':  re.findall(r'Improvement[:\s]+(.+)', text),
#             'table_count': len(tables),
#             'raw_tables': [
#                 [[str(c) if c else '' for c in row] for row in tbl]
#                 for tbl in tables
#             ],
#         }

#     def _assessment(self, text, tables):
#         return {
#             'assessment_type': self._get(r'(Mid|Final|Quiz|Assignment)\s*(Exam|Term)?',
#                                           text, re.I),
#             'total_marks':     self._get(r'Total\s*Marks?[:\s]+(\d+)', text),
#             'table_count': len(tables),
#         }

#     def _generic(self, text, tables):
#         return {
#             'word_count':  len(text.split()),
#             'table_count': len(tables),
#             'char_count':  len(text),
#         }
    
#     def _get(self, pattern, text, flags=0):
#         m = re.search(pattern, text, flags)
#         return m.group(1).strip() if m else None