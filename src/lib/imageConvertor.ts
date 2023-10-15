export function convertImgToBase64(
    reader: FileReader,
    file: File,
    callbackFn: ({ resizedImgStr, error }: { resizedImgStr?: string; error?: any }) => any
) {
    reader.onload = function (event: ProgressEvent<FileReader>) {
        const base64String = event.target?.result as string;
        if (!base64String) {
            callbackFn({ error: 'Failed to convert image' });
            return;
        }
        resizeBase64Image(base64String, callbackFn);
    };
    reader.onerror = function () {
        callbackFn({ error: 'Failed to convert image' });
    };
    reader.readAsDataURL(file);
}

function resizeBase64Image(
    base64Str: string,
    callbackFn: ({ resizedImgStr, error }: { resizedImgStr?: string; error?: any }) => any,
    maxWidth: number = 793,
    maxHeight: number = 500
) {
    const img = new Image();

    img.onload = function () {
        let width = img.width;
        let height = img.height;

        if (width > height) {
            if (width > maxWidth) {
                height *= maxWidth / width;
                width = maxWidth;
            }
        } else {
            if (height > maxHeight) {
                width *= maxHeight / height;
                height = maxHeight;
            }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');

        if (ctx) {
            ctx.drawImage(img, 0, 0, width, height);
            const resizedImgStr = canvas.toDataURL('image/jpeg');
            callbackFn({ resizedImgStr });
        } else {
            callbackFn({ error: 'Failed to get canvas context.' });
        }
    };

    img.onerror = function () {
        callbackFn({ error: 'Failed to load image.' });
    };

    img.src = base64Str;
}
