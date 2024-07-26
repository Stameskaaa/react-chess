import './index.css';
const ModalComponent = ({ message, onRetry, closeModal }) => {
  return (
    <>
      {
        <div className="modal-overlay">
          <div className="modal-content">
            <button className="modal-close" onClick={closeModal}>
              &times;
            </button>
            <p>{message}</p>
            <button className="modal-retry" onClick={onRetry}>
              &#x21bb;
            </button>
          </div>
        </div>
      }
    </>
  );
};

export default ModalComponent;
