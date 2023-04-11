import { CarImage } from "@modules/cars/infra/typeorm/entities/CarImage";
import { ICarsImagesRepository } from "@modules/cars/repositories/ICarsImagesRepository";
import { IcarsRepository } from "@modules/cars/repositories/ICarsRepository";
import { IStorageProvider } from "@shared/container/providers/StorageProvider/IStorageProvider";
import { deleteFile } from "@utils/file";
import { inject, injectable } from "tsyringe";
import { validate } from "uuid";

interface IRequest {
  car_id: string;
  images_name: string[];
}

interface IResponse {
  imagesSaved: string[];
  imagesAlreadyExists: string[];
}

async function filterCarImages(
  receivedImages: string[], 
  savedImages: CarImage[]
  ){
    
  const firstDash = /-(.+)/;

  function includesSavedImageName(
    receivedImage: string, 
    savedImageNames: string[]
    ){
    
    return savedImageNames.some(savedImageName => 
      receivedImage.includes(savedImageName)
    );
  }

  const savedImageNames = savedImages.map(savedImage => 
    savedImage.image_name.split(firstDash)[1]
  );

  const imagesToSave = receivedImages.filter(receivedImage => 
    !includesSavedImageName(receivedImage, savedImageNames)
  );

  const imagesToDelete = receivedImages.filter(receivedImage => 
    includesSavedImageName(receivedImage, savedImageNames)
  );

  for (const imageToDelete of imagesToDelete) {
    await deleteFile(`./tmp/cars/${imageToDelete}`);
  }

  return {
    imagesToSave,
    imagesToDelete: imagesToDelete.map(img => img.split(firstDash)[1])
  };
}

@injectable()
export class UploadCarImageUseCase {
  
  constructor (
    @inject("CarsRepository")
    private carsRepository: IcarsRepository,
    @inject("CarsImagesRepository")
    private carsImagesRepository: ICarsImagesRepository,
    @inject("StorageProvider")
    private storageProvider: IStorageProvider
  ) {}

  async execute({ car_id, images_name: receivedImages }: IRequest): Promise<IResponse> {

    if(!validate(car_id)) {
      throw new Error("Car not found or invalid car id!");
    }

    const carDoesNotExist = await this.carsRepository.findById(car_id);
     
    if(!carDoesNotExist) {
      throw new Error("Car not found or invalid car id!");
    }

    const firstDash = /-(.+)/;
    const savedImages = await this.carsImagesRepository.findById(car_id);
    const objOfImages = await filterCarImages(receivedImages, savedImages);

    const imagesSaved = await Promise.all(objOfImages.imagesToSave.map(async (image) => {
      const resImagesSaved = await this.carsImagesRepository.create(car_id, image);
      await this.storageProvider.save(image, "cars");
      return resImagesSaved.image_name.split(firstDash)[1];
    }));

    const imagesToDeletePathTmp = await Promise.all(objOfImages.imagesToDelete.map(async (imageName) => {
      return receivedImages.filter(receivedImage => receivedImage.includes(imageName))
    }));

    imagesToDeletePathTmp.map(async image => await deleteFile(`./tmp/${image}`));

    return {
      imagesSaved,
      imagesAlreadyExists: objOfImages.imagesToDelete
    }
  }
}