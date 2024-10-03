import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useSelector, useDispatch } from 'react-redux';
import { UpdateProfile } from '../Redux/Slices/RegisterSlice';

const Profile = () => {
  const [state, setState] = useState({
    profileData: {
      name: '',
      rollno: '',
      className: '',
      image: '..',  
    },
    imageFile: null,
    isEditing: false,
    errorMessage: '',
    successMessage: '',
  });

  const RollNo = useSelector((state) => state?.login?.students?.[0]?.rollno);
  const dispatch = useDispatch();

  
    const fetchProfileData = async () => {
      try {
        const response = await axios.get(`http://localhost:4000/api/getStudent/${RollNo}`);
        if (response.data.success) {
          setState((prevState) => ({
            ...prevState,
            profileData: response.data.profile,
          }));
        } else {
          setState((prevState) => ({
            ...prevState,
            errorMessage: response.data.message,
          }));
        }
      } catch (error) {
        console.error('Error fetching profile data:', error);
        setState((prevState) => ({
          ...prevState,
          errorMessage: 'Error fetching profile data',
        }));
      }
    };
    useEffect(() => {
    if (RollNo) {
      fetchProfileData();
    }
  }, [RollNo]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setState((prevState) => ({
      ...prevState,
      profileData: {
        ...prevState.profileData,
        [name]: value,
      },
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setState((prevState) => ({
        ...prevState,
        imageFile: file,
        profileData: {
          ...prevState.profileData,
          image: URL.createObjectURL(file),  
        },
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append('name', state.profileData.name);
      formData.append('rollno', state.profileData.rollno);
      formData.append('className', state.profileData.className);
      if (state.imageFile) {
        formData.append('image', state.imageFile);
      }

      const response = await axios.put('http://localhost:4000/api/edit', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      if (response.data.success) {
        setState((prevState) => ({
          ...prevState,
          successMessage: 'Profile updated successfully',
          isEditing: false,
          profileData: {
            ...prevState.profileData,
          }
        
        }));
        dispatch(UpdateProfile(response.data.studentRecord));
      } else {
        setState((prevState) => ({
          ...prevState,
          errorMessage: response.data.message,
        }));
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      setState((prevState) => ({
        ...prevState,
        errorMessage: 'Error updating profile',
      }));
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg flex">
      <div className="flex-shrink-0 mr-6">
        <img
          src={state.profileData.image}
          alt="Profile"
          className="w-40 h-40 rounded-full object-cover border-2 border-gray-300"
        />
        {state.isEditing && (
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="mt-4"
          />
        )}
      </div>

      <div className="flex-grow">
        <h2 className="text-2xl font-bold mb-6 text-center">My Profile</h2>

        {state.errorMessage && <div className="mb-4 p-3 bg-red-100 text-red-800 border border-red-400 rounded-lg">{state.errorMessage}</div>}
        {state.successMessage && <div className="mb-4 p-3 bg-green-100 text-green-800 border border-green-400 rounded-lg">{state.successMessage}</div>}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700">Name</label>
            <input
              type="text"
              name="name"
              value={state.profileData.name}
              onChange={handleChange}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-lg"
              disabled={!state.isEditing}
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700">Roll Number</label>
            <input
              type="text"
              name="rollno"
              value={state.profileData.rollno}
              onChange={handleChange}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-lg"
              disabled
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700">Class Name</label>
            <input
              type="text"
              name="className"
              value={state.profileData.className}
              onChange={handleChange}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-lg"
              disabled={!state.isEditing}
            />
          </div>

          {state.isEditing ? (
            <div className="flex justify-end">
              <button type="button" onClick={() => setState((prevState) => ({ ...prevState, isEditing: false }))} className="mr-2 p-2 bg-gray-300 rounded-lg">Cancel</button>
              <button type="submit" className="p-2 bg-blue-500 text-white rounded-lg">Save</button>
            </div>
          ) : (
            <div className="flex justify-end">
              <button type="button" onClick={() => setState((prevState) => ({ ...prevState, isEditing: true }))} className="p-2 bg-green-500 text-white rounded-lg">Edit Profile</button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default Profile;
