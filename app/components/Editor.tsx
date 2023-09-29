import { Editor as TinyMCEEditor } from '@tinymce/tinymce-react';
import { useTranslation } from 'react-i18next';

type Props = {
  /**
   * The initial value of the editor.
   */
  initialValue?: string;

  /**
   * The name of the textarea that will be used to store the editor's content.
   * This will be used when submitting the form.
   */
  name: string;

  onChange?: (content: string) => void;
};

export default function Editor({ initialValue, name, onChange }: Props) {
  const { i18n } = useTranslation();

  return (
    <>
      <TinyMCEEditor
        tinymceScriptSrc="/tinymce/tinymce.min.js"
        textareaName={name}
        initialValue={initialValue}
        onEditorChange={(content) => {
          if (onChange) {
            onChange(content);
          }
        }}
        init={{
          height: 500,
          width: '100%',
          menubar: false,
          language: i18n.language,
          images_upload_url: '/api/images/upload',
          automatic_uploads: true,
          file_picker_callback: function (callback, value, meta) {
            // Taken from the TinyMCE documentation: https://www.tiny.cloud/docs/tinymce/6/image/#interactive-example
            const input = document.createElement('input');
            input.type = 'file';
            input.setAttribute('accept', 'image/*');

            input.addEventListener('change', (e) => {
              if (!e.target) return;
              const input = e.target as HTMLInputElement;
              if (!input.files?.length) return;
              const file = input.files[0];

              const reader = new FileReader();
              reader.addEventListener('load', () => {
                /*
                  Note: Now we need to register the blob in TinyMCEs image blob
                  registry. In the next release this part hopefully won't be
                  necessary, as we are looking to handle it internally.
                */
                const id = 'blobid' + new Date().getTime();
                const blobCache = (window as any).tinymce.activeEditor
                  .editorUpload.blobCache;
                const base64 = (reader.result as string)?.split(',')[1];
                const blobInfo = blobCache.create(id, file, base64);
                blobCache.add(blobInfo);

                /* call the callback and populate the Title field with the file name */
                callback(blobInfo.blobUri(), { title: file.name });
              });
              reader.readAsDataURL(file);
            });

            input.click();
          },
          file_picker_types: 'image',
          a11y_advanced_options: true,
          plugins: [
            'advlist',
            'autolink',
            'lists',
            'link',
            'image',
            'charmap',
            'anchor',
            'searchreplace',
            'visualblocks',
            'code',
            'fullscreen',
            'insertdatetime',
            'media',
            'table',
            'preview',
            'help',
            'wordcount',
          ],
          toolbar:
            'undo redo | fontfamily styles | ' +
            'bold italic forecolor | image media | alignleft aligncenter ' +
            `alignright alignjustify | bullist numlist outdent indent | ` +
            'removeformat | help',
          block_formats:
            'Paragraph=p; Heading 1=h2; Heading 2=h3; Heading 3=h4;',
          font_family_formats:
            'Satoshi=Satoshi-Regular, sans-serif; Satoshi-Black=Satoshi Black, sans-serif; Typewrite Condensed=Typewrite Condensed, serif',
          content_css: '/editor-styles.css',
        }}
      />
    </>
  );
}
