import React, { useState } from 'react';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { InputTextarea } from 'primereact/inputtextarea';
import { FileUpload } from 'primereact/fileupload';
import 'primereact/resources/themes/lara-light-indigo/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';

const DialogDemo = () => {
    const [display, setDisplay] = useState(false);
    const [position, setPosition] = useState('center');
    const [content, setContent] = useState('');
    const onClick = (position) => {
        setDisplay(true);

        if (position) {
            setPosition(position);
        }
        setContent('');
    };

    const onHide = () => {
        setDisplay(false);
        setContent('');
    };

    const renderFooter = () => {
        return (
            <div>
                <Button label="Post" icon="pi pi-check" onClick={() => onHide()} autoFocus />
                <Button label="Cancel" icon="pi pi-times" onClick={() => onHide()} className="p-button-text" />
            </div>
        );
    };

    return (
        <div className="dialog-demo">
            <div className="card">
                <Button icon="pi pi-pencil" label="Tweet" onClick={() => onClick()} />
                <Dialog
                    header="Tweet"
                    visible={display}
                    style={{ width: '50vw' }}
                    footer={renderFooter()}
                    onHide={() => onHide()}
                >
                    <InputTextarea
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        placeholder="Write a content"
                        rows={5}
                    />
                    <FileUpload name="demo[]" url="./upload" multiple accept="image/*" mode="basic" />
                </Dialog>
            </div>
        </div>
    );
};

export default DialogDemo;
