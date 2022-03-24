import "./styles.css";
import { useEffect, useRef, useState } from "react";
export default function App() {
  const [images, setimages] = useState([]);
  // const [index,setIndex]=useState(20);
  const index = useRef(20);
  const reff = useRef();
  const getImages = async () => {
    const res = await fetch("https://jsonplaceholder.typicode.com/photos");
    const result = await res.json();
    setimages((prev) => [
      ...prev,
      ...result.slice(index.current, index.current + 20)
    ]);
  };
  //to check if pages end reached
  //IntersectionObeserver(callback,options)
  //callback-to trigger once reached end of element

  useEffect(() => {
    const getImages = async () => {
      const res = await fetch("https://jsonplaceholder.typicode.com/photos");
      const result = await res.json();
      setimages(result.slice(0, index.current));
    };
    getImages();
  }, []);
  useEffect(() => {
    index.current += 20;
  }, [images]);
  //to keep track of element so that oberver can be assigned to element
  useEffect(() => {
    //get ref element
    const currentElement = reff.current;
    //create observer
    const observer = new IntersectionObserver(
      (entries) => {
        let first = entries[0];
        if (
          first.intersectionRect.bottom - first.boundingClientRect.bottom <=
          5
        ) {
          console.log("hi");
          getImages();
        }
      },
      { threshold: 1 }
    );
    const currentObserver = observer;
    if (currentElement) {
      currentObserver.observe(currentElement);
    }
    return () => {
      if (currentElement) currentObserver.unobserve(currentElement);
    };
  }, [reff]);

  return (
    <div className="App">
      <div className="gallery">
        {images.map((elem) => {
          return (
            <div className="card">
              <div>{elem.title}</div>
              <img src={elem.url} />
            </div>
          );
        })}
      </div>
      <div ref={reff}></div>
    </div>
  );
}
