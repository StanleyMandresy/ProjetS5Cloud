// src/services/photo.service.ts
// Version base64 - stockage direct dans Firestore (sans Firebase Storage)
import { Capacitor } from '@capacitor/core'
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera'

export interface UserPhoto {
  filepath: string
  webviewPath: string
  base64Data: string // base64 complet avec prefix data:image/...
}

class PhotoService {

  /**
   * Methode principale : ajouter une photo
   * Detecte automatiquement si on est sur web ou natif
   */
  async addPhoto(): Promise<UserPhoto | null> {
    if (Capacitor.isNativePlatform()) {
      return this.takePhotoNative()
    }
    return this.pickPhotoWeb()
  }

  /**
   * NATIF : Utiliser Capacitor Camera (Android/iOS)
   */
  private async takePhotoNative(): Promise<UserPhoto | null> {
    try {
      const photo = await Camera.getPhoto({
        resultType: CameraResultType.Base64,
        source: CameraSource.Prompt,
        quality: 60,
        width: 800,
        height: 800,
        correctOrientation: true,
        promptLabelHeader: 'Ajouter une photo',
        promptLabelPhoto: 'Galerie',
        promptLabelPicture: 'Camera'
      })

      if (!photo.base64String) {
        console.warn('Aucune image capturee')
        return null
      }

      const format = photo.format || 'jpeg'
      const fileName = `photo_${Date.now()}.${format}`
      const base64Data = `data:image/${format};base64,${photo.base64String}`

      return {
        filepath: fileName,
        webviewPath: base64Data,
        base64Data
      }
    } catch (error: any) {
      console.warn('Camera annulee:', error.message)
      return null
    }
  }

  /**
   * WEB : Utiliser un input file HTML (fonctionne dans le navigateur)
   */
  private pickPhotoWeb(): Promise<UserPhoto | null> {
    return new Promise((resolve) => {
      const input = document.createElement('input')
      input.type = 'file'
      input.accept = 'image/*'
      input.capture = 'environment'

      input.onchange = async (event: any) => {
        const file = event.target.files?.[0]
        if (!file) {
          resolve(null)
          return
        }

        try {
          // Compresser et convertir en base64
          const base64Data = await this.compressAndConvert(file)
          const fileName = `photo_${Date.now()}.jpeg`

          resolve({
            filepath: fileName,
            webviewPath: base64Data,
            base64Data
          })
        } catch (err) {
          console.error('Erreur lecture fichier:', err)
          resolve(null)
        }
      }

      input.oncancel = () => {
        resolve(null)
      }

      input.click()
    })
  }

  /**
   * Compresser une image et la convertir en base64
   * Reduit la taille pour rester sous la limite Firestore (1 MB par document)
   */
  private compressAndConvert(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = (e) => {
        const img = new Image()
        img.onload = () => {
          const canvas = document.createElement('canvas')
          const MAX_SIZE = 800 // Max 800px

          let width = img.width
          let height = img.height

          // Redimensionner si necessaire
          if (width > MAX_SIZE || height > MAX_SIZE) {
            if (width > height) {
              height = Math.round((height * MAX_SIZE) / width)
              width = MAX_SIZE
            } else {
              width = Math.round((width * MAX_SIZE) / height)
              height = MAX_SIZE
            }
          }

          canvas.width = width
          canvas.height = height

          const ctx = canvas.getContext('2d')!
          ctx.drawImage(img, 0, 0, width, height)

          // Convertir en JPEG compresse (qualite 0.5)
          const base64Data = canvas.toDataURL('image/jpeg', 0.5)
          console.log(`Photo compressee: ${Math.round(base64Data.length / 1024)} KB`)
          resolve(base64Data)
        }
        img.onerror = reject
        img.src = e.target?.result as string
      }
      reader.onerror = reject
      reader.readAsDataURL(file)
    })
  }

  /**
   * Retourne les base64 des photos pour stockage Firestore
   */
  getPhotosBase64(photos: UserPhoto[]): string[] {
    return photos.map(p => p.base64Data)
  }
}

export const photoService = new PhotoService()
