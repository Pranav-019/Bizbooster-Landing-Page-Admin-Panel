import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './css/Displayinfo.css';

const Video = () => {
  const [videos, setVideos] = useState([]);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);

  useEffect(() => {
    fetchVideos();
  }, []);

  const fetchVideos = async () => {
    try {
      const response = await fetch('https://biz-booster-landingpage-backend.vercel.app/api/videos/get');
      if (!response.ok) throw new Error('Failed to fetch videos');
      const data = await response.json();
      setVideos(data || []);
      setLoading(false);
    } catch (err) {
      setError(err.message || 'Failed to fetch videos');
      setLoading(false);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedVideo(file);
    }
  };

  const uploadVideo = async () => {
    if (!selectedVideo) return;
    
    try {
      setIsUploading(true);
      setUploadProgress(0);
      
      const formData = new FormData();
      formData.append('video', selectedVideo);

      const response = await fetch('https://biz-booster-landingpage-backend.vercel.app/api/videos/upload', {
        method: 'POST',
        body: formData,
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setUploadProgress(percentCompleted);
        }
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || 'Failed to upload video');
      }

      await fetchVideos();
      setSelectedVideo(null);
      setIsUploading(false);
      setUploadProgress(0);
    } catch (err) {
      setError(err.message || 'Failed to upload video');
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  const deleteVideo = async (id) => {
    if (!id) return;
    
    try {
      const response = await fetch(`https://biz-booster-landingpage-backend.vercel.app/api/videos/delete/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || 'Failed to delete video');
      }

      await fetchVideos();
    } catch (err) {
      setError(err.message || 'Failed to delete video');
    }
  };

  const formatBytes = (bytes, decimals = 2) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  };

  if (loading) return <div className="text-center py-5">Loading videos...</div>;
  if (error) return <div className="alert alert-danger text-center">{error}</div>;

  return (
    <div className="container py-5">
      <h1 className="mb-5 text-center fw-bold text-gradient">Video Dashboard</h1>

      <div className="d-flex justify-content-end mb-4">
        <div className="position-relative">
          <input
            type="file"
            id="videoUpload"
            className="d-none"
            accept="video/*"
            onChange={handleFileChange}
            disabled={isUploading}
          />
          <label
            htmlFor="videoUpload"
            className={`btn btn-primary shadow-sm ${isUploading ? 'disabled' : ''}`}
          >
            <i className="bi bi-cloud-arrow-up me-2"></i>
            {selectedVideo ? 'Change Video' : 'Upload New Video'}
          </label>
          {selectedVideo && (
            <div className="position-absolute top-100 start-0 mt-2 p-2 bg-white shadow-sm rounded">
              <div className="d-flex align-items-center">
                <i className="bi bi-file-earmark-play-fill text-primary me-2"></i>
                <div>
                  <div className="small">{selectedVideo.name}</div>
                  <div className="text-muted small">{formatBytes(selectedVideo.size)}</div>
                </div>
              </div>
            </div>
          )}
        </div>
        {selectedVideo && (
          <button
            className="btn btn-success shadow-sm ms-2"
            onClick={uploadVideo}
            disabled={isUploading}
          >
            {isUploading ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                Uploading... {uploadProgress}%
              </>
            ) : (
              <>
                <i className="bi bi-check-circle me-2"></i>
                Confirm Upload
              </>
            )}
          </button>
        )}
      </div>

      <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
        {videos.map((video) => (
          <div key={video._id} className="col">
            <div className="card h-100 shadow-sm border-0 hover-card">
              <div className="card-body d-flex flex-column">
                <div className="ratio ratio-16x9 mb-3">
                  <video controls className="rounded">
                    <source src={video.video} type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                </div>
                <div className="d-flex justify-content-between align-items-center">
                  <small className="text-muted">
                    Uploaded: {new Date(video.createdAt).toLocaleDateString()}
                  </small>
                  <button
                    className="btn btn-sm btn-outline-danger"
                    onClick={() => deleteVideo(video._id)}
                  >
                    <i className="bi bi-trash me-1"></i> Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {videos.length === 0 && !selectedVideo && (
        <div className="text-center py-5">
          <i className="bi bi-film display-4 text-muted mb-3"></i>
          <h4>No videos uploaded yet</h4>
          <p className="text-muted">Click the "Upload New Video" button to add your first video</p>
        </div>
      )}
    </div>
  );
};

export default Video;