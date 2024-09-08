import { useContext, useEffect } from "react";
import { GlobalContext } from "../../../context";
import classes from './styles.module.css';
import { FaChevronDown, FaChevronUp, FaDownload, FaRedo, FaSearchPlus, FaUndo } from "react-icons/fa";
import { FaRegCircleXmark } from "react-icons/fa6";

export default function ImageSlider() {
  const { images, selectedImage, setSelectedImage } = useContext(GlobalContext);

  function handleImageClick(id) {
    setSelectedImage(id);
  }

  function showPreviousImg() {
    if (selectedImage === 0) {
      setSelectedImage(images.length - 1);
    } else {
      setSelectedImage(selectedImage - 1);
    }
    console.log(selectedImage)
  }

  function showNextImg() {
    if (selectedImage === images.length - 1) {
      setSelectedImage(0);
    } else {
      setSelectedImage(selectedImage + 1);
    }
    console.log(selectedImage)
  }

  useEffect(() => {
    function handleKeyDown(event) {
      if (event.key === 'ArrowDown') {
        showNextImg();
      } else if (event.key === 'ArrowUp') {
        showPreviousImg();
      }
    }

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [selectedImage, images.length]);

  return (
    <div className={classes.slider_container}>
      <div className={classes.data_container}>
        <div className={classes.image_left}>
          <p>{images[selectedImage]['scene_id']}</p>
          <div>
            <img src={images[selectedImage]["img_path"]} />
          </div>
          <div className={classes.btn_container}>
            <button onClick={showPreviousImg}>
              <FaChevronUp style={{ backgroundColor: "#212A37" }} />
            </button>
            <button onClick={showNextImg}>
              <FaChevronDown style={{ backgroundColor: "#212A37" }} />
            </button>
          </div>
        </div>

        <div className={classes.image_right}>
          {images.map((image, idx) => (
            <img
              key={idx}
              src={image['img_path']}
              className={
                idx === selectedImage
                  ? `${classes.selected} ${classes.img}`
                  : classes.img
              }
              onClick={() => handleImageClick(idx)}
            />
          ))}
        </div>
      </div>

      <div className={classes.image_footer}>
        <button>
          <FaDownload style={{ backgroundColor: "transparent" }} />
        </button>
        <div style={{ backgroundColor: "transparent" }}>
          <button>
            <FaUndo style={{ backgroundColor: "transparent" }} />
          </button>
          <button>
            <FaRedo style={{ backgroundColor: "transparent" }} />
          </button>
        </div>
        <button>
          <FaSearchPlus style={{ backgroundColor: "transparent" }} />
        </button>
      </div>

      <div className={classes.close}>
        <FaRegCircleXmark onClick={() => setSelectedImage(null)} />
      </div>
    </div>
  );
}
