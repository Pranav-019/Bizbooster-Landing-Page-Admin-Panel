import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import logoImage from '../Data/artisticify-logo.jpeg'; // Import the company logo

const Quotation = () => {
  const [packages, setPackages] = useState([]);
  const [selectedPackage, setSelectedPackage] = useState('');
  const [packageDetails, setPackageDetails] = useState(null);
  const [customPrice, setCustomPrice] = useState('');
  const [customPoints, setCustomPoints] = useState('');

  useEffect(() => {
    axios
      .get('https://Artisticify-backend.vercel.app/api/packages')
      .then((response) => setPackages(response.data))
      .catch((error) => console.error('Error fetching packages:', error));
  }, []);

  const handlePackageChange = (e) => {
    const packageId = e.target.value;
    const selected = packages.find((pkg) => pkg._id === packageId);
    setSelectedPackage(packageId);
    setPackageDetails(selected);
    setCustomPrice('');
    setCustomPoints('');
  };

  const generateQuotationPDF = () => {
    if (!packageDetails) {
      alert('Please select a package to generate the quotation.');
      return;
    }

    const { name, type, category, features, description } = packageDetails;
    const price = type === 'Premium' ? customPrice || 'Customizable' : packageDetails.price;
    const points = type === 'Premium' ? (customPoints ? customPoints : 'N/A') : 'N/A';

    const doc = new jsPDF();

    // Add logo
    const imgProps = doc.getImageProperties(logoImage);
    const logoWidth = 40;
    const logoHeight = (imgProps.height * logoWidth) / imgProps.width;
    doc.addImage(logoImage, 'PNG', 10, 10, logoWidth, logoHeight);

    // Add semi-transparent watermark
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const watermarkWidth = 150;
    const watermarkHeight = (imgProps.height * watermarkWidth) / imgProps.width;
    doc.setGState(new doc.GState({ opacity: 0.1 })); // Set transparency
    doc.addImage(
      logoImage,
      'PNG',
      (pageWidth - watermarkWidth) / 2,
      (pageHeight - watermarkHeight) / 2,
      watermarkWidth,
      watermarkHeight
    );
    doc.setGState(new doc.GState({ opacity: 1 })); // Reset transparency

    // Artisticify heading
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(22);

    // Contact details
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(12);
    doc.textWithLink('Phone: +91-9112452929', 14, 30, { url: 'tel:+919112452929' });
    doc.textWithLink('Email: info@Artisticify.com', 14, 40, { url: 'mailto:info@Artisticify.com' });

    // Title and details
    doc.setFontSize(18);
    doc.text('Quotation', 14, 60);
    doc.setFontSize(14);
    doc.text(`Package Name: ${name}`, 14, 70);
    doc.text(`Package Type: ${type}`, 14, 80);
    doc.text(`Category: ${category}`, 14, 90);
    doc.text(`Price: ${price}`, 14, 100);
    doc.text(`Points: ${points}`, 14, 110);

    // Description
    doc.text('Description:', 14, 120);
    doc.setFontSize(12);
    doc.text(description || 'N/A', 14, 130, { maxWidth: 180 });

    // Features table
    doc.text('Features:', 14, 150);
    doc.autoTable({
      startY: 160,
      head: [['Features']],
      body: features.map((feature) => [feature]),
      styles: {
        cellPadding: 2,
        fontSize: 10,
        overflow: 'linebreak',
      },
      margin: { top: 5, left: 14, right: 14 },
      tableWidth: 'wrap',
    });

    // Terms and conditions
    const tableEndY = doc.lastAutoTable.finalY;
    doc.text('Terms and Conditions:', 14, tableEndY + 10);
    doc.setFontSize(10);
    const terms = [
      '1. The quotation is valid for 30 days from the issue date.',
      '2. Payment must be made in full before project commencement.',
      '3. Any changes to the project scope may incur additional charges.',
      '4. The quoted price includes only the listed features.',
    ];
    terms.forEach((term, index) => {
      doc.text(term, 14, tableEndY + 20 + index * 10);
    });

    // Save PDF
    doc.save(`${name}-quotation.pdf`);
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif', backgroundColor: '#f4f4f9' }}>
      <h2 style={{ textAlign: 'center', color: '#333', fontSize: '26px', fontWeight: 'bold' }}>
        Generate Quotation
      </h2>

      <div style={{ marginBottom: '20px' }}>
        <label htmlFor="packageSelect" style={{ fontSize: '16px' }}>Select a Package:</label>
        <select
          id="packageSelect"
          value={selectedPackage}
          onChange={handlePackageChange}
          style={{
            padding: '10px',
            fontSize: '16px',
            borderRadius: '8px',
            border: '1px solid #ccc',
            width: '100%',
            maxWidth: '300px',
            display: 'block',
            margin: '10px auto',
          }}
        >
          <option value="">-- Select a Package --</option>
          {packages.map((pkg) => (
            <option key={pkg._id} value={pkg._id}>
              {pkg.name}
            </option>
          ))}
        </select>
      </div>

      {packageDetails && (
        <div
          style={{
            border: '1px solid #ccc',
            padding: '20px',
            borderRadius: '10px',
            marginBottom: '20px',
            backgroundColor: '#fff',
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
          }}
        >
          <h3 style={{ color: '#2e3d49', fontSize: '20px', fontWeight: 'bold' }}>
            {packageDetails.name}
          </h3>
          <p><strong>Type:</strong> {packageDetails.type}</p>
          <p><strong>Category:</strong> {packageDetails.category}</p>
          {packageDetails.type === 'Premium' ? (
            <>
              <p><strong>Custom Price:</strong>
                <input
                  type="number"
                  value={customPrice}
                  onChange={(e) => setCustomPrice(e.target.value)}
                  placeholder="Enter custom price"
                  style={{
                    padding: '8px',
                    fontSize: '16px',
                    borderRadius: '5px',
                    border: '1px solid #ccc',
                    width: '100%',
                    maxWidth: '300px',
                    display: 'block',
                    marginTop: '10px',
                  }}
                />
              </p>
              <p><strong>Custom Points:</strong>
                <input
                  type="text"
                  value={customPoints}
                  onChange={(e) => setCustomPoints(e.target.value)}
                  placeholder="Enter custom points"
                  style={{
                    padding: '8px',
                    fontSize: '16px',
                    borderRadius: '5px',
                    border: '1px solid #ccc',
                    width: '100%',
                    maxWidth: '300px',
                    display: 'block',
                    marginTop: '10px',
                  }}
                />
              </p>
            </>
          ) : (
            <p><strong>Price:</strong> {packageDetails.price}</p>
          )}
          <h4 style={{ marginTop: '20px' }}>Features:</h4>
          <ul>
            {packageDetails.features.map((feature, index) => (
              <li key={index} style={{ fontSize: '16px', color: '#555' }}>{feature}</li>
            ))}
          </ul>
        </div>
      )}

      <div style={{ textAlign: 'center' }}>
        <button
          onClick={generateQuotationPDF}
          style={{
            padding: '12px 24px',
            fontSize: '16px',
            backgroundColor: '#007bff',
            color: '#fff',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            transition: 'background-color 0.3s ease',
          }}
        >
          Generate Quotation PDF
        </button>
      </div>
    </div>
  );
};

export default Quotation;
