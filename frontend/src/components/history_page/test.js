const jsonArray = [
  '{"img_path": "L11/V028/0188.webp", "scene_id": "/L11/V028/62", "frm_number": "4533", "frm_id": "207357", "format": "L11_V028, 4533", "publish_date": "29/03/2024", "watch_url": "https://youtube.com/watch?v=wIKR0OJwD9U&t=181s", "answer": "anhinla"}',
  '{"img_path": "L01/V009/0669.webp", "scene_id": "/L01/V009/222", "frm_number": "18257", "frm_id": "4911", "format": "L01_V009, 18257", "publish_date": "23/10/2023", "watch_url": "https://youtube.com/watch?v=eVcdL95KTuo&t=730s", "answer": "20"}',
]

const objectsArray = jsonArray.map((jsonString) => JSON.parse(jsonString))

console.log(objectsArray)
