const AWS = require('aws-sdk');
const { v4: uuidv4 } = require('uuid');

AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION
});

const s3 = new AWS.S3();

exports.uploadToS3 = async (file, folder) => {
  try {
    const fileExtension = file.originalname.split('.').pop();
    const fileName = `${folder}/${uuidv4()}.${fileExtension}`;

    const params = {
      Bucket: process.env.AWS_S3_BUCKET,
      Key: fileName,
      Body: file.buffer,
      ContentType: file.mimetype,
      ACL: 'public-read'
    };

    const result = await s3.upload(params).promise();
    return result.Location;
  } catch (error) {
    console.error('S3 upload error:', error);
    throw new Error('File upload failed');
  }
};

exports.deleteFromS3 = async (fileUrl) => {
  try {
    const key = fileUrl.split('.com/')[1];
    
    const params = {
      Bucket: process.env.AWS_S3_BUCKET,
      Key: key
    };

    await s3.deleteObject(params).promise();
    return { success: true };
  } catch (error) {
    console.error('S3 delete error:', error);
    throw new Error('File deletion failed');
  }
};