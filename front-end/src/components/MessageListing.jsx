import React from 'react';
import ProfileIcon from "../assets/profile.svg";
import MissingImage from "../assets/missingImage.svg";

function MessageListing() {
    const images = Array(6).fill(MissingImage);

    return(
        <div style={styles.container}>
            <h1 style={styles.title}>Listing Name: $XX</h1>

            <div style={styles.contentArea}>
                <div style={styles.imageContainer}>
                    <div style={styles.images}>
                    {images.map((src, index) => (<img key={index} src={src} alt={`Profile ${index + 1}`} style={styles.image} />))}
                    </div>
                </div>
                <div style={styles.descriptionContainer}>
                    <h2 style={styles.descriptionTitle}>Description</h2>
                    <p style={styles.descriptionContent}>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus non mauris semper, ultricies velit eget, pellentesque purus. Vestibulum a urna ac purus cursus bibendum vitae mattis nisl. Quisque facilisis elementum metus, sit amet accumsan erat consectetur quis. Aliquam eleifend tellus nisl, ut semper dui viverra at. Ut mauris est, rutrum efficitur aliquet eu, pretium ac ante. Sed rutrum mauris ut dui imperdiet, sed suscipit libero venenatis. In cursus nulla egestas nisl ullamcorper iaculis. Mauris condimentum maximus odio, sed tincidunt dolor hendrerit vitae. Pellentesque blandit gravida dui, et vulputate nisi semper quis. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae;
Morbi dignissim est a interdum maximus. Aenean ac consectetur massa. Nam quis sapien vehicula lacus fringilla eleifend. Fusce posuere mi turpis, id congue mauris pretium ut. Ut ullamcorper turpis metus, congue finibus velit hendrerit eu. Duis nec nisi ut est sollicitudin malesuada. Sed id dolor placerat magna consectetur accumsan non vitae ipsum. Integer dui metus, convallis sollicitudin ex nec, fermentum sollicitudin augue. Duis at suscipit enim. Curabitur id maximus nulla, quis venenatis massa.
Donec accumsan dapibus urna id ornare. Aliquam sagittis velit eu mi dapibus, vitae vestibulum velit mattis. Aliquam aliquet, sem ac tristique ornare, urna ex tincidunt nibh, at dignissim quam est ac risus. Quisque gravida, tellus vel tempus porttitor, ante erat hendrerit purus, vitae congue odio justo eget elit. Morbi vitae dictum odio, vel placerat mi. Aliquam dictum, mauris in tristique lacinia, justo sapien condimentum neque, ac bibendum felis ante et elit. In cursus libero sed porta eleifend. Aliquam sit amet velit libero. Aliquam lorem neque, consequat a pulvinar egestas, auctor eu ipsum. Sed quis velit erat. Duis sit amet bibendum sapien, non porttitor orci.</p>
                </div>
            </div>
            
        </div>
    );
}
``
const styles = {
    container: {
    height: "100%",
    width: "100%",
    display: "flex",
    flexDirection: "column",
    overflow: "hidden",
  },
  title: {
    fontFamily: "Roboto, sans-serif",
    margin: "10px",
  },
  contentArea: {
    flexGrow: 1,
    display: "flex",
    flexDirection: "column",
    overflow: "hidden",
  },
  imageContainer: {

    width: "100%",
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    gridTemplateRows: "repeat(2, 1fr)",
    gap: "2px",
  },
  images: {
    display: "contents", // let the grid layout take over
  },
  image: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    cursor: "pointer",
  },
  descriptionContainer: {
    flexGrow: 1,
    overflowY: "auto",
    background: "#D3D3D3",
    margin: "10px",
    borderRadius: "10px",
    padding: "10px",
    boxSizing: "border-box",
  },
  descriptionTitle: {
    fontFamily: "Roboto, sans-serif",
    marginBottom: "5px",
  },
  descriptionContent: {
    fontFamily: "Roboto, sans-serif",
  },

}

export default MessageListing;