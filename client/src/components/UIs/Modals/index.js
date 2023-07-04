import React from 'react';
import './Modal.css'
import { Modal,Button } from 'react-bootstrap'
const index=({show, header, children,onClose, size})=> {
  return (
    <Modal show={show} onHide={onClose} size={size}>
    <Modal.Header closeButton>
      <Modal.Title>{header}</Modal.Title>
    </Modal.Header>
    <Modal.Body>{children}</Modal.Body>
    <Modal.Footer>
      <Button variant="danger" onClick={onClose}>
        Close
      </Button>
    </Modal.Footer>
  </Modal>
  )
}

export default index;

