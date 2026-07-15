import { supabase } from '@/supabase'

export const perfilService = {
    async actualizarAvatar(file, userId) {
        // 1. Crear nombre único para la imagen
        const fileExt = file.name.split('.').pop()
        const filePath = `${userId}/avatar-${Date.now()}.${fileExt}`

        // 2. Subir a Supabase Storage (Bucket 'avatars')
        const { error: uploadError } = await supabase.storage
            .from('avatars')
            .upload(filePath, file, {
                upsert: true,
                contentType: file.type,
                cacheControl: '3600'
            })

        if (uploadError) throw uploadError

        // 3. Obtener la URL pública de la nueva imagen
        const { data: publicUrlData } = supabase.storage
            .from('avatars')
            .getPublicUrl(filePath)

        const newAvatarUrl = publicUrlData.publicUrl

        // 4. Actualizar los metadatos del usuario en Supabase Auth
        const { error: updateError } = await supabase.auth.updateUser({
            data: { avatar_url: newAvatarUrl }
        })

        if (updateError) throw updateError

        return newAvatarUrl
    }
}