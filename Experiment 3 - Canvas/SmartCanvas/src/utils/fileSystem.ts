import * as MediaLibrary from 'expo-media-library';
import * as FileSystem from 'expo-file-system';
import { SkImage, ImageFormat } from '@shopify/react-native-skia';

export const saveImageToGallery = async (image: SkImage): Promise<boolean> => {
  try {
    const { status } = await MediaLibrary.requestPermissionsAsync();
    
    if (status !== 'granted') {
      alert('Permission to access media library is required to save images.');
      return false;
    }

    // Encode directly to Base64
    const base64 = image.encodeToBase64(ImageFormat.PNG, 100);
    if (!base64) {
        console.error("Failed to encode image to base64");
        return false;
    }

    const filename = `${FileSystem.documentDirectory}drawing_${Date.now()}.png`;

    await FileSystem.writeAsStringAsync(filename, base64, {
      encoding: FileSystem.EncodingType.Base64,
    });

    const asset = await MediaLibrary.createAssetAsync(filename);
    await MediaLibrary.createAlbumAsync('SmartCanvas', asset, false);

    alert('Image saved to gallery!');
    return true;

  } catch (error) {
    console.error('Error saving image:', error);
    alert('Failed to save image.');
    return false;
  }
};
