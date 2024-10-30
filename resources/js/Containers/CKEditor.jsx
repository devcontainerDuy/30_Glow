import React, { useEffect, useRef } from "react";
import PropTypes from "prop-types";

const CKEditor = React.memo(({ onBlur, value }) => {
    const editorRef = useRef(null);

    useEffect(() => {
        if (window.CKEDITOR) {
            const options = {
                filebrowserImageBrowseUrl: "/laravel-filemanager?type=Images",
                filebrowserImageUploadUrl:
                    "/laravel-filemanager/upload?type=Images&_token=",
                filebrowserBrowseUrl: "/laravel-filemanager?type=Files",
                filebrowserUploadUrl:
                    "/laravel-filemanager/upload?type=Files&_token=",
            };

            // editorRef.current = window.CKEDITOR.replace("editor", options);
            const editorElement = document.getElementById("editor");
            if (editorElement) {
                editorRef.current = window.CKEDITOR.replace(
                    editorElement,
                    options
                );
                // Set editor height
                editorRef.current.config.height = 300;

                // Set initial value
                editorRef.current.setData(value);

                // Handle change events
                editorRef.current.on("blur", () => {
                    const data = editorRef.current.getData();
                    if (onBlur) {
                        onBlur(data);
                    }
                });
            }
        }

        return () => {
            if (window.CKEDITOR.instances.editor) {
                window.CKEDITOR.instances.editor.destroy(true);
            }
        };
    }, []);

    useEffect(() => {
        if (editorRef.current && editorRef.current.getData() !== value) {
            editorRef.current.setData(value);
        }
    }, [value]);

    return <textarea id="editor"></textarea>;
});

export default CKEditor;

CKEditor.propTypes = {
    value: PropTypes.string,
    onBlur: PropTypes.func,
};
