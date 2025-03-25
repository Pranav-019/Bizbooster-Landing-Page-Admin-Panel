import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  TextField,
  Button,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Grid,
  Typography,
  CircularProgress,
} from "@mui/material";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css"; // Import styles for the carousel

const OurWork = () => {
  const [category, setCategory] = useState("");
  const [subCategory, setSubCategory] = useState("");
  const [imageFiles, setImageFiles] = useState([]);
  const [previewUrls, setPreviewUrls] = useState([]);
  const [works, setWorks] = useState([]);
  const [loadingWorks, setLoadingWorks] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Fetch existing works from the backend
  const fetchWorks = async () => {
    setLoadingWorks(true);
    try {
      const response = await axios.get(
        "https://Artisticify-backend.vercel.app/api/ourwork/fetch"
      );
      setWorks(response.data.data || []);
    } catch (error) {
      console.error("Error fetching works:", error);
    } finally {
      setLoadingWorks(false);
    }
  };

  useEffect(() => {
    fetchWorks();
  }, []);

  // Handle form submission
  const handleSubmit = async () => {
    if (!category || imageFiles.length === 0) {
      alert("Please fill all required fields.");
      return;
    }

    setSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("category", category);
      if (subCategory) formData.append("subCategory", subCategory);

      imageFiles.forEach((file) => {
        formData.append("images", file);
      });

      const response = await axios.post(
        "https://Artisticify-backend.vercel.app/api/ourwork/insert",
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      alert(response.data.message);
      fetchWorks(); // Refresh the works list
    } catch (error) {
      console.error("Error submitting work:", error);
      alert("Submission failed. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  // Handle image files change and preview generation
  const handleImageChange = (e) => {
    const files = e.target.files;
    if (files) {
      setImageFiles(Array.from(files));
      const previews = Array.from(files).map((file) =>
        URL.createObjectURL(file)
      );
      setPreviewUrls(previews);
    }
  };

  // Cleanup URL objects on component unmount
  useEffect(() => {
    return () => {
      previewUrls.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [previewUrls]);

  // Handle delete request
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this work?")) {
      try {
        const response = await axios.delete(
          `https://Artisticify-backend.vercel.app/api/ourwork/delete/${id}`
        );
        alert(response.data.message);
        fetchWorks(); // Refresh the works list after deletion
      } catch (error) {
        console.error("Error deleting work:", error);
        alert("Error deleting work. Please try again.");
      }
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <Typography variant="h4" gutterBottom>
        Our Work Gallery
      </Typography>

      <Grid container spacing={3}>
        {/* Form Section */}
        <Grid item xs={12} md={6}>
          <Typography variant="h6">Add New Work</Typography>
          <FormControl fullWidth margin="normal">
            <InputLabel>Category</InputLabel>
            <Select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              label="Category"
            >
              <MenuItem value="logo">logo</MenuItem>
              <MenuItem value="brochure">brochure</MenuItem>
              <MenuItem value="poster">poster</MenuItem>
              <MenuItem value="flyer">flyer</MenuItem>
              <MenuItem value="packaging">packaging</MenuItem>
              <MenuItem value="ui/ux">ui/ux</MenuItem>
              <MenuItem value="icon">icon</MenuItem>
              <MenuItem value="magazine">magazine</MenuItem>
              <MenuItem value="visual aid">visual Aid</MenuItem>
              <MenuItem value="stationary">stationary</MenuItem>
            </Select>
          </FormControl>

          {category === "stationary" && (
            <FormControl fullWidth margin="normal">
              <InputLabel>subCategory</InputLabel>
              <Select
                value={subCategory}
                onChange={(e) => setSubCategory(e.target.value)}
                label="SubCategory"
              >
                <MenuItem value="envelope">envelope</MenuItem>
                <MenuItem value="menu-card">menu card</MenuItem>
                <MenuItem value="certificate">certificate</MenuItem>
              </Select>
            </FormControl>
          )}

          <div style={{ marginTop: "10px" }}>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleImageChange}
            />
            {previewUrls.length > 0 && (
              <div style={{ marginTop: "10px" }}>
                {previewUrls.map((url, index) => (
                  <img
                    key={index}
                    src={url}
                    alt="Preview"
                    style={{
                      width: "100px",
                      height: "100px",
                      objectFit: "cover",
                      marginRight: "10px",
                    }}
                  />
                ))}
              </div>
            )}
          </div>

          <Button
            variant="contained"
            color="primary"
            onClick={handleSubmit}
            disabled={submitting}
            style={{ marginTop: "10px" }}
          >
            {submitting ? <CircularProgress size={24} /> : "Submit"}
          </Button>
        </Grid>

        {/* Gallery Section */}
        <Grid item xs={12} md={6}>
          <Typography variant="h6">Existing Works</Typography>
          {loadingWorks ? (
            <CircularProgress />
          ) : works.length > 0 ? (
            <Grid container spacing={2}>
              {works.map((work) => (
                <Grid item xs={12} md={6} key={work._id}>
                  <div style={{ padding: "10px", border: "1px solid #ddd" }}>
                    <Typography variant="h6">{work.category}</Typography>
                    <Typography variant="body2">
                      {work.subCategory || "N/A"}
                    </Typography>

                    {/* Carousel for images */}
                    <Carousel
  showArrows={true}
  infiniteLoop={true}
  useKeyboardArrows={true}
  dynamicHeight={true}
  autoPlay={true} // Enable auto-play
  interval={3000} // Set interval to 3 seconds (adjust as needed)
>
  {work.images.map((url, index) => (
    <div key={index}>
      <img
        src={url}
        alt={`work ${index}`}
        style={{
          width: "100%",
          height: "auto",
        }}
      />
    </div>
  ))}
</Carousel>

                    <Button
                      variant="outlined"
                      color="secondary"
                      onClick={() => handleDelete(work._id)}
                      style={{ marginTop: "10px" }}
                    >
                      Delete
                    </Button>
                  </div>
                </Grid>
              ))}
            </Grid>
          ) : (
            <Typography>No works available.</Typography>
          )}
        </Grid>
      </Grid>
    </div>
  );
};

export default OurWork;
