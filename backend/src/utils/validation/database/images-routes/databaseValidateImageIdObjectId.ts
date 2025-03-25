import { ObjectId } from "mongodb";
import CustomError from "../../../../constants/customError";
import { ImageModel } from "../../../../models/image.model";

export default async function databaseValidateImageIdObjectId(
  imageId: ObjectId,
  returnImageDocument: boolean
) {
  const findImage = await ImageModel.findOne(imageId);

  if (!findImage) throw new CustomError(404, "Image not found");

  if (returnImageDocument) {
    return findImage;
  }
}
