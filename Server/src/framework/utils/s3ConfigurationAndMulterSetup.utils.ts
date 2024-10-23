import { S3Client } from "@aws-sdk/client-s3";
import multer, { MulterError } from "multer";
import multerS3 from "multer-s3";

const s3 = new S3Client({
    region: process.env.AWS_REGION || "",
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID || "",
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || "",
    },
});

const upload = multer({
    storage: multerS3({
        s3: s3,
        bucket: process.env.AWS_BUCKET_NAME || "",
        metadata: (req, file, cb) => {
            cb(null, { fieldName: file.fieldname });
        },
        key: (req, file, cb) => {
            const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
            cb(null, `uploads/${uniqueSuffix}-${file.originalname}`); // make the file name unique
        },
    }),
    fileFilter: (req, file, cb) => {
        const allowedTypes: Set<string> = new Set(["image/png", "image/jpeg", "image/gif", "image/bmp", "image/svg+xml", "video/mp4", "video/avi", "video/mov", "video/x-matroska", "video/x-flv", "application/pdf", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document", "application/vnd.ms-excel", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", "application/vnd.ms-powerpoint", "application/vnd.openxmlformats-officedocument.presentationml.presentation", "audio/mpeg", "audio/wav", "audio/x-wav", "audio/ogg", "audio/aac", "audio/flac", "audio/x-ms-wma", "audio/x-aiff", "audio/midi", "audio/x-midi", "audio/webm"]);
        if (allowedTypes.has(file.mimetype)) {
          cb(null, true); // accepet file
        } else {
            cb(null, false);
        }
    },
});

export default upload;