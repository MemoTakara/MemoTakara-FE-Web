if (audioFileList.length > 0 && audioFileList[0].originFileObj) {
  formData.append("audio_file", audioFileList[0].originFileObj);
}
if (imageFileList.length > 0 && imageFileList[0].originFileObj) {
  formData.append("image", imageFileList[0].originFileObj);
}
