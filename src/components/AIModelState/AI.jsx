import React, { useState, useEffect } from 'react';
import Card from '../Card/Card';
import { fetchModelData } from '../../Helpers/apiHelper'; // Adjust the path based on your file structure
import Chip from '@mui/material/Chip';

const AI = () => {
  const [aiModelStatus, setAiModelStatus] = useState([]);

  useEffect(() => {
    fetchAiModelStatus();
  }, []);

  const fetchAiModelStatus = async () => {
    try {
      const response = await fetchModelData();
      console.log('Full response from server:', response); // Debug log

      if (response && response.status === "success" && response.data && response.data.assets) {
        const assets = response.data.assets;
        const statuses = assets.map(asset => ({
          name: asset.name,
          Model: asset.model, // Assuming 'model' represents the Model
          status: asset.predictive_maintenance === 'none' ? 'Everything is good' : `Maintenance: ${asset.predictive_maintenance}`
        }));
        console.log('Extracted statuses:', statuses); // Debug log

        setAiModelStatus(statuses);
      } else {
        console.warn('Unexpected response structure:', response);
        setAiModelStatus([{ name: 'Unavailable', Model: 'Unavailable', status: 'Unavailable' }]);
      }
    } catch (error) {
      console.error('Error fetching AI model status:', error);
      setAiModelStatus([{ name: 'Unavailable', Model: 'Unavailable', status: 'Unavailable' }]);
    }
  };

  return (
    <Card className="flex-1 p-4">
      <h2 className="text-lg font-bold mb-4">AI Model Status</h2>
      {aiModelStatus.length > 0 ? (
        <table className="min-w-full bg-white">
          <thead>
            <tr>
              <th className="py-2">Asset Name</th>
              <th className="py-2">Model Name</th>
              <th className="py-2">Status</th>
            </tr>
          </thead>
          <tbody>
            {aiModelStatus.map((asset, index) => (
              <tr key={index} className="text-center">
                <td className="py-2">{asset.name}</td>
                <td className="py-2">{asset.Model}</td>
                <td className="py-2">
                  <Chip
                    label={asset.status}
                    style={{
                      backgroundColor: asset.status === 'Everything is good' ? '#4CAF50' : '#F44336',
                      color: '#ffffff' // white text color
                    }}
                    className="p-2"
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <div className="loading">Loading...</div>
      )}
    </Card>
  );
};

export default AI;
