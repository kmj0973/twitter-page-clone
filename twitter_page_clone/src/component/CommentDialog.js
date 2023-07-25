import React, { useState } from "react";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { InputTextarea } from "primereact/inputtextarea";
const CommnetDialog = () => {
  const [visi, setVisi] = useState(false);
  const [comment, setComment] = useState("");
  const onClick = () => {
    setVisi((e) => !e);
  };
  const onHide = () => {
    setVisi((e) => !e);
  };
  const onChange = (event) => {
    const {
      target: { value },
    } = event;
    setComment(value);
  };
  const footer = (
    <div>
      <Button label="add" icon="pi pi-check" onClick={onHide} />
    </div>
  );

  return (
    <>
      <div onClick={onClick}>댓글</div>
      <Dialog
        header="Comments"
        headerStyle={{ alignContent: "center" }}
        draggable={false}
        dismissableMask={true}
        footer={footer}
        visible={visi}
        style={{ width: "50vw", height: "100vw" }}
        modal
        onHide={onHide}
        position="bottom"
      >
        <div className="dialog-body">
          <div>현재 달린 댓글이 없습니다.</div>
          <div className="dialog-body__add-comment">
            <div>댓글 추가</div>
            <InputTextarea autoResize value={comment} onChange={onChange} placeholder="Write your mind!!" rows={5} />
          </div>
        </div>
      </Dialog>
    </>
  );
};

export default CommnetDialog;
