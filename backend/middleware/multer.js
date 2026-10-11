import multer from "multer";
import { storage } from "../cloudConfig.js";

const upload = multer({storage: storage,
                       fileFilter: (req, file, cb) => {
                            if (file.mimetype === "image/jpeg" || file.mimetype === "image/png" || file.mimetype === "image/jpg") {
                                cb(null, true);
                            } else {
                                cb(new Error("Only JPG and PNG images are allowed"));
                            }
                        }
});

export default upload;