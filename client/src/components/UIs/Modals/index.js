import React from 'react'
import { Modal } from 'react-bootstrap'
const index=({footer, show, header, children,onClose, size})=> {
  return (
    <div>
      <Modal show={show} onHide={onClose} size={size}>
          <Modal.Header>
              {header}
          </Modal.Header>
          <Modal.Body>
              {children}
          </Modal.Body>
          <Modal.Footer>
               <button onClick={onClose}><i className="fa fa-times" aria-hidden="true"  style={{color:"red"}}></i></button>
          </Modal.Footer>
      </Modal>
    </div>
  )
}

export default index;
