'use client';

import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import { motion, Variants } from 'framer-motion';
import { toast } from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { CldUploadWidget } from 'next-cloudinary';

interface RegistrationFormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  contactPersonName: string;
  contactPersonPhone: string;
  contactPersonEmail: string;
  organizationType: string;
  registrationNumber: string;
  street: string;
  city: string;
  state: string;
  pincode: string;
  focusAreas: string[];
  website: string;
  registrationCertificateUrl: string;
  taxExemptionCertificateUrl?: string;
}

// Add interface for the request body with documents
interface NGORegistrationRequest {
  name: string;
  email: string;
  password: string;
  contactPerson: {
    name: string;
    phone: string;
    email: string;
  };
  organizationType: string;
  registrationNumber: string;
  address: {
    street: string;
    city: string;
    state: string;
    pincode: string;
  };
  focusAreas: string[];
  website: string;
  documents: {
    registrationCertificate: string;
    taxExemptionCertificate?: string;
  };
}

interface CloudinaryResult {
  info: {
    secure_url: string;
  };
}

const variants: Variants = {
  hidden: { opacity: 0, x: 20 },
  visible: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -20 }
};

const progressVariants: Variants = {
  initial: { width: 0 },
  animate: (progress: number) => ({
    width: `${progress}%`,
    transition: { duration: 0.3 }
  })
};

const RegistrationForm = () => {
  const { register, handleSubmit, formState: { errors }, watch, setValue, trigger } = useForm<RegistrationFormData>({
    mode: 'onChange',
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      contactPersonName: '',
      contactPersonPhone: '',
      contactPersonEmail: '',
      organizationType: '',
      registrationNumber: '',
      street: '',
      city: '',
      state: '',
      pincode: '',
      focusAreas: [],
      website: '',
      registrationCertificateUrl: '',
      taxExemptionCertificateUrl: ''
    }
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 3; // Reduced to 3 meaningful steps
  const [mounted, setMounted] = useState(false);
  const router = useRouter();
  
  // Watch for password to compare with confirmPassword
  const password = watch('password');

  useEffect(() => {
    setMounted(true);
  }, []);

  // Validate the current step before proceeding
  const validateCurrentStep = async () => {
    let fieldsToValidate: (keyof RegistrationFormData)[] = [];
    
    switch (currentStep) {
      case 1: // Basic Information
        fieldsToValidate = ['name', 'email', 'password', 'confirmPassword', 'organizationType', 'registrationNumber'];
        break;
      case 2: // Contact & Address
        fieldsToValidate = ['contactPersonName', 'contactPersonPhone', 'contactPersonEmail', 'street', 'city', 'state', 'pincode'];
        break;
      case 3: // Documents & Focus Areas
        fieldsToValidate = ['focusAreas', 'registrationCertificateUrl'];
        break;
    }
    
    const result = await trigger(fieldsToValidate);
    return result;
  };

  const nextStep = async () => {
    const isValid = await validateCurrentStep();
    if (isValid) {
      setCurrentStep(prev => Math.min(prev + 1, totalSteps));
    } else {
      toast.error("Please fill all required fields correctly before proceeding");
    }
  };

  const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 1));

  const onSubmit = async (data: RegistrationFormData) => {
    const isValid = await validateCurrentStep();
    if (!isValid) {
      toast.error("Please fill all required fields correctly before submitting");
      return;
    }
    
    try {
      setIsSubmitting(true);
      const apiUrl = process.env.NEXT_PUBLIC_API_URL;

      // Create the request body according to the API documentation
      const requestBody: NGORegistrationRequest = {
        name: data.name,
        email: data.email,
        password: data.password,
        contactPerson: {
          name: data.contactPersonName,
          phone: data.contactPersonPhone,
          email: data.contactPersonEmail
        },
        organizationType: data.organizationType,
        registrationNumber: data.registrationNumber,
        address: {
          street: data.street,
          city: data.city,
          state: data.state,
          pincode: data.pincode
        },
        focusAreas: data.focusAreas,
        website: data.website || '',
        documents: {
          registrationCertificate: data.registrationCertificateUrl
        }
      };

      // Add tax exemption certificate if available
      if (data.taxExemptionCertificateUrl) {
        requestBody.documents.taxExemptionCertificate = data.taxExemptionCertificateUrl;
      }

      console.log('Submitting form data:', requestBody);

      const response = await axios.post(`${apiUrl}/api/ngo/register`, requestBody, {
        headers: {
          'Content-Type': 'application/json',
        },
        withCredentials: true
      });

      if (response.data.success) {
        toast.success('Registration submitted successfully! Please wait for admin approval.');
        // Store the NGO ID for status checking
        localStorage.setItem('ngoRegistrationId', response.data.data.id);
        
        // Display status page or redirect to status check
        router.push(`/register/status?id=${response.data.data.id}`);
      } else {
        throw new Error(response.data.message || 'Registration failed');
      }
    } catch (error) {
      console.error('Registration error:', error);
      if (axios.isAxiosError(error)) {
        const errorMessage = error.response?.data?.message || error.message || 'Registration failed';
        console.error('Error details:', {
          status: error.response?.status,
          statusText: error.response?.statusText,
          data: error.response?.data,
          message: error.message
        });
        toast.error(errorMessage);
      } else {
        console.error('Unexpected error:', error);
        toast.error('An unexpected error occurred');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCloudinaryUpload = (result: CloudinaryResult, fieldName: 'registrationCertificateUrl' | 'taxExemptionCertificateUrl') => {
    if (result.info && result.info.secure_url) {
      setValue(fieldName, result.info.secure_url);
      // Trigger validation after setting the value
      trigger(fieldName);
    }
  };

  const renderProgressBar = () => {
    const progress = (currentStep / totalSteps) * 100;
    return (
      <div className="w-full bg-gradient-to-r from-theme-nature/20 to-primary-100 dark:from-theme-heart/20 dark:to-theme-heart/5 rounded-full h-2.5 mb-6">
        <motion.div
          className="bg-gradient-to-r from-theme-nature to-primary-500 dark:from-theme-heart dark:to-theme-paw h-2.5 rounded-full"
          style={{ width: `${progress}%` }}
          variants={progressVariants}
          initial="hidden"
          animate="visible"
          custom={progress}
        />
      </div>
    );
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <motion.div
            variants={variants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="space-y-6"
          >
            <h3 className="text-xl font-semibold bg-gradient-to-r from-theme-nature via-primary-500 to-theme-heart bg-clip-text text-transparent dark:from-theme-paw dark:via-theme-sky dark:to-theme-heart">Organization Details</h3>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">NGO Name <span className="text-theme-heart">*</span></label>
                <input
                  type="text"
                  {...register('name', { required: 'NGO name is required' })}
                  className="mt-1 block w-full rounded-md border-secondary-300 dark:border-border-dark bg-white dark:bg-card-dark shadow-sm focus:border-theme-nature dark:focus:border-theme-heart focus:ring-theme-nature dark:focus:ring-theme-heart sm:text-sm"
                />
                {errors.name && <p className="mt-1 text-sm text-theme-heart">{errors.name.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Email <span className="text-theme-heart">*</span></label>
                <input
                  type="email"
                  {...register('email', {
                    required: 'Email is required',
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: 'Invalid email address'
                    }
                  })}
                  className="mt-1 block w-full rounded-md border-secondary-300 dark:border-border-dark bg-white dark:bg-card-dark shadow-sm focus:border-theme-nature dark:focus:border-theme-heart focus:ring-theme-nature dark:focus:ring-theme-heart sm:text-sm"
                />
                {errors.email && <p className="mt-1 text-sm text-theme-heart">{errors.email.message}</p>}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Password <span className="text-theme-heart">*</span></label>
                <input
                  type="password"
                  {...register('password', {
                    required: 'Password is required',
                    minLength: {
                      value: 8,
                      message: 'Password must be at least 8 characters'
                    }
                  })}
                  className="mt-1 block w-full rounded-md border-secondary-300 dark:border-border-dark bg-white dark:bg-card-dark shadow-sm focus:border-theme-nature dark:focus:border-theme-heart focus:ring-theme-nature dark:focus:ring-theme-heart sm:text-sm"
                />
                {errors.password && <p className="mt-1 text-sm text-theme-heart">{errors.password.message}</p>}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Confirm Password <span className="text-theme-heart">*</span></label>
                <input
                  type="password"
                  {...register('confirmPassword', {
                    required: 'Please confirm your password',
                    validate: value => value === password || 'Passwords do not match'
                  })}
                  className="mt-1 block w-full rounded-md border-secondary-300 dark:border-border-dark bg-white dark:bg-card-dark shadow-sm focus:border-theme-nature dark:focus:border-theme-heart focus:ring-theme-nature dark:focus:ring-theme-heart sm:text-sm"
                />
                {errors.confirmPassword && <p className="mt-1 text-sm text-theme-heart">{errors.confirmPassword.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Organization Type <span className="text-theme-heart">*</span></label>
                <select
                  {...register('organizationType', { required: 'Organization type is required' })}
                  className="mt-1 block w-full rounded-md border-secondary-300 dark:border-border-dark bg-white dark:bg-card-dark shadow-sm focus:border-theme-nature dark:focus:border-theme-heart focus:ring-theme-nature dark:focus:ring-theme-heart sm:text-sm"
                >
                  <option value="">Select organization type</option>
                  <option value="Animal Welfare">Animal Welfare</option>
                  <option value="Wildlife Conservation">Wildlife Conservation</option>
                  <option value="Pet Adoption">Pet Adoption</option>
                  <option value="Other">Other</option>
                </select>
                {errors.organizationType && <p className="mt-1 text-sm text-theme-heart">{errors.organizationType.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Registration Number <span className="text-theme-heart">*</span></label>
                <input
                  type="text"
                  {...register('registrationNumber', { required: 'Registration number is required' })}
                  className="mt-1 block w-full rounded-md border-secondary-300 dark:border-border-dark bg-white dark:bg-card-dark shadow-sm focus:border-theme-nature dark:focus:border-theme-heart focus:ring-theme-nature dark:focus:ring-theme-heart sm:text-sm"
                />
                {errors.registrationNumber && <p className="mt-1 text-sm text-theme-heart">{errors.registrationNumber.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Website (Optional)</label>
                <input
                  type="url"
                  {...register('website')}
                  className="mt-1 block w-full rounded-md border-secondary-300 dark:border-border-dark bg-white dark:bg-card-dark shadow-sm focus:border-theme-nature dark:focus:border-theme-heart focus:ring-theme-nature dark:focus:ring-theme-heart sm:text-sm"
                  placeholder="https://example.com"
                />
                {errors.website && <p className="mt-1 text-sm text-theme-heart">{errors.website.message}</p>}
              </div>
            </div>
          </motion.div>
        );

      case 2:
        return (
          <motion.div
            variants={variants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="space-y-6"
          >
            <h3 className="text-xl font-semibold bg-gradient-to-r from-theme-nature via-primary-500 to-theme-heart bg-clip-text text-transparent dark:from-theme-paw dark:via-theme-sky dark:to-theme-heart">Contact & Address Details</h3>
            <div className="space-y-6">
              <h4 className="text-lg font-medium text-gray-900 dark:text-white">Contact Person Details</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Contact Person Name <span className="text-theme-heart">*</span></label>
                  <input
                    type="text"
                    {...register('contactPersonName', { required: 'Contact person name is required' })}
                    className="mt-1 block w-full rounded-md border-secondary-300 dark:border-border-dark bg-white dark:bg-card-dark shadow-sm focus:border-theme-nature dark:focus:border-theme-heart focus:ring-theme-nature dark:focus:ring-theme-heart sm:text-sm"
                  />
                  {errors.contactPersonName && <p className="mt-1 text-sm text-theme-heart">{errors.contactPersonName.message}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Contact Person Phone <span className="text-theme-heart">*</span></label>
                  <input
                    type="tel"
                    {...register('contactPersonPhone', { 
                      required: 'Contact person phone is required',
                      pattern: {
                        value: /^[0-9]{10}$/,
                        message: 'Please enter a valid 10-digit phone number'
                      }
                    })}
                    className="mt-1 block w-full rounded-md border-secondary-300 dark:border-border-dark bg-white dark:bg-card-dark shadow-sm focus:border-theme-nature dark:focus:border-theme-heart focus:ring-theme-nature dark:focus:ring-theme-heart sm:text-sm"
                  />
                  {errors.contactPersonPhone && <p className="mt-1 text-sm text-theme-heart">{errors.contactPersonPhone.message}</p>}
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Contact Person Email <span className="text-theme-heart">*</span></label>
                  <input
                    type="email"
                    {...register('contactPersonEmail', {
                      required: 'Contact person email is required',
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: 'Invalid email address'
                      }
                    })}
                    className="mt-1 block w-full rounded-md border-secondary-300 dark:border-border-dark bg-white dark:bg-card-dark shadow-sm focus:border-theme-nature dark:focus:border-theme-heart focus:ring-theme-nature dark:focus:ring-theme-heart sm:text-sm"
                  />
                  {errors.contactPersonEmail && <p className="mt-1 text-sm text-theme-heart">{errors.contactPersonEmail.message}</p>}
                </div>
              </div>

              <h4 className="text-lg font-medium text-gray-900 dark:text-white">Address Details</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Street Address <span className="text-theme-heart">*</span></label>
                  <input
                    type="text"
                    {...register('street', { required: 'Street address is required' })}
                    className="mt-1 block w-full rounded-md border-secondary-300 dark:border-border-dark bg-white dark:bg-card-dark shadow-sm focus:border-theme-nature dark:focus:border-theme-heart focus:ring-theme-nature dark:focus:ring-theme-heart sm:text-sm"
                  />
                  {errors.street && <p className="mt-1 text-sm text-theme-heart">{errors.street.message}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">City <span className="text-theme-heart">*</span></label>
                  <input
                    type="text"
                    {...register('city', { required: 'City is required' })}
                    className="mt-1 block w-full rounded-md border-secondary-300 dark:border-border-dark bg-white dark:bg-card-dark shadow-sm focus:border-theme-nature dark:focus:border-theme-heart focus:ring-theme-nature dark:focus:ring-theme-heart sm:text-sm"
                  />
                  {errors.city && <p className="mt-1 text-sm text-theme-heart">{errors.city.message}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">State <span className="text-theme-heart">*</span></label>
                  <select
                    {...register('state', { required: 'State is required' })}
                    className="mt-1 block w-full rounded-md border-secondary-300 dark:border-border-dark bg-white dark:bg-card-dark shadow-sm focus:border-theme-nature dark:focus:border-theme-heart focus:ring-theme-nature dark:focus:ring-theme-heart sm:text-sm"
                  >
                    <option value="">Select State</option>
                    <option value="Andhra Pradesh">Andhra Pradesh</option>
                    <option value="Arunachal Pradesh">Arunachal Pradesh</option>
                    <option value="Assam">Assam</option>
                    <option value="Bihar">Bihar</option>
                    <option value="Chhattisgarh">Chhattisgarh</option>
                    <option value="Delhi">Delhi</option>
                    <option value="Goa">Goa</option>
                    <option value="Gujarat">Gujarat</option>
                    <option value="Haryana">Haryana</option>
                    <option value="Himachal Pradesh">Himachal Pradesh</option>
                    <option value="Jharkhand">Jharkhand</option>
                    <option value="Karnataka">Karnataka</option>
                    <option value="Kerala">Kerala</option>
                    <option value="Madhya Pradesh">Madhya Pradesh</option>
                    <option value="Maharashtra">Maharashtra</option>
                    <option value="Manipur">Manipur</option>
                    <option value="Meghalaya">Meghalaya</option>
                    <option value="Mizoram">Mizoram</option>
                    <option value="Nagaland">Nagaland</option>
                    <option value="Odisha">Odisha</option>
                    <option value="Punjab">Punjab</option>
                    <option value="Rajasthan">Rajasthan</option>
                    <option value="Sikkim">Sikkim</option>
                    <option value="Tamil Nadu">Tamil Nadu</option>
                    <option value="Telangana">Telangana</option>
                    <option value="Tripura">Tripura</option>
                    <option value="Uttar Pradesh">Uttar Pradesh</option>
                    <option value="Uttarakhand">Uttarakhand</option>
                    <option value="West Bengal">West Bengal</option>
                  </select>
                  {errors.state && <p className="mt-1 text-sm text-theme-heart">{errors.state.message}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Pincode <span className="text-theme-heart">*</span></label>
                  <input
                    type="text"
                    {...register('pincode', {
                      required: 'Pincode is required',
                      pattern: {
                        value: /^\d{6}$/,
                        message: 'Please enter a valid 6-digit pincode'
                      }
                    })}
                    className="mt-1 block w-full rounded-md border-secondary-300 dark:border-border-dark bg-white dark:bg-card-dark shadow-sm focus:border-theme-nature dark:focus:border-theme-heart focus:ring-theme-nature dark:focus:ring-theme-heart sm:text-sm"
                  />
                  {errors.pincode && <p className="mt-1 text-sm text-theme-heart">{errors.pincode.message}</p>}
                </div>
              </div>
            </div>
          </motion.div>
        );

      case 3:
        return (
          <motion.div
            variants={variants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="space-y-6"
          >
            <h3 className="text-xl font-semibold bg-gradient-to-r from-theme-nature via-primary-500 to-theme-heart bg-clip-text text-transparent dark:from-theme-paw dark:via-theme-sky dark:to-theme-heart">Focus Areas & Documents</h3>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Focus Areas <span className="text-theme-heart">*</span></label>
                <div className="mt-2 space-y-2">
                  {['Animal Rescue', 'Pet Adoption', 'Wildlife Conservation', 'Animal Sheltering', 'Animal Healthcare', 'Animal Rights Advocacy', 'Other'].map((area) => (
                    <label key={area} className="inline-flex items-center mr-6 mb-2">
                      <input
                        type="checkbox"
                        value={area}
                        {...register('focusAreas', { required: 'Select at least one focus area' })}
                        className="rounded border-secondary-300 dark:border-border-dark bg-white dark:bg-card-dark text-theme-nature dark:text-theme-heart focus:border-theme-nature dark:focus:border-theme-heart"
                      />
                      <span className="ml-2">{area}</span>
                    </label>
                  ))}
                </div>
                {errors.focusAreas && <p className="mt-1 text-sm text-theme-heart">{errors.focusAreas.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Registration Certificate <span className="text-theme-heart">*</span> 
                  <span className="text-xs text-gray-500 ml-2">(Please upload an image file)</span>
                </label>
                
                {watch('registrationCertificateUrl') ? (
                  <div className="mb-4">
                    <div className="flex items-center justify-between p-2 border rounded-md">
                      <div className="flex items-center space-x-2">
                        <div 
                          className="h-16 w-16 rounded-md bg-cover bg-center" 
                          style={{ backgroundImage: `url(${watch('registrationCertificateUrl')})` }}
                        />
                        <span className="text-sm text-gray-600 dark:text-gray-400">Uploaded successfully</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => setValue('registrationCertificateUrl', '')}
                        className="text-red-500 hover:text-red-700"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ) : (
                  <CldUploadWidget
                    uploadPreset="ml_default"
                    options={{
                      maxFiles: 1,
                      resourceType: "image",
                    }}
                    onSuccess={(result) => handleCloudinaryUpload(result as CloudinaryResult, 'registrationCertificateUrl')}
                  >
                    {({ open }) => (
                      <button
                        type="button"
                        onClick={() => open()}
                        className="w-full flex justify-center items-center px-6 pt-5 pb-6 border-2 border-dashed border-secondary-300 dark:border-border-dark rounded-md"
                      >
                        <div className="space-y-1 text-center">
                          <svg
                            className="mx-auto h-12 w-12 text-gray-400"
                            stroke="currentColor"
                            fill="none"
                            viewBox="0 0 48 48"
                            aria-hidden="true"
                          >
                            <path
                              d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                              strokeWidth={2}
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                          <div className="flex text-sm text-gray-600 justify-center">
                            <span className="relative cursor-pointer bg-white rounded-md font-medium text-theme-nature hover:text-theme-nature/90">
                              Upload Registration Certificate
                            </span>
                          </div>
                          <p className="text-xs text-gray-500">PNG, JPG, JPEG up to 10MB</p>
                        </div>
                      </button>
                    )}
                  </CldUploadWidget>
                )}
                {errors.registrationCertificateUrl && (
                  <p className="mt-1 text-sm text-theme-heart">{errors.registrationCertificateUrl.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Tax Exemption Certificate (Optional)
                  <span className="text-xs text-gray-500 ml-2">(Please upload an image file)</span>
                </label>
                
                {watch('taxExemptionCertificateUrl') ? (
                  <div className="mb-4">
                    <div className="flex items-center justify-between p-2 border rounded-md">
                      <div className="flex items-center space-x-2">
                        <div 
                          className="h-16 w-16 rounded-md bg-cover bg-center" 
                          style={{ backgroundImage: `url(${watch('taxExemptionCertificateUrl')})` }}
                        />
                        <span className="text-sm text-gray-600 dark:text-gray-400">Uploaded successfully</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => setValue('taxExemptionCertificateUrl', '')}
                        className="text-red-500 hover:text-red-700"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ) : (
                  <CldUploadWidget
                    uploadPreset="ml_default"
                    options={{
                      maxFiles: 1,
                      resourceType: "image",
                    }}
                    onSuccess={(result) => handleCloudinaryUpload(result as CloudinaryResult, 'taxExemptionCertificateUrl')}
                  >
                    {({ open }) => (
                      <button
                        type="button"
                        onClick={() => open()}
                        className="w-full flex justify-center items-center px-6 pt-5 pb-6 border-2 border-dashed border-secondary-300 dark:border-border-dark rounded-md"
                      >
                        <div className="space-y-1 text-center">
                          <svg
                            className="mx-auto h-12 w-12 text-gray-400"
                            stroke="currentColor"
                            fill="none"
                            viewBox="0 0 48 48"
                            aria-hidden="true"
                          >
                            <path
                              d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                              strokeWidth={2}
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                          <div className="flex text-sm text-gray-600 justify-center">
                            <span className="relative cursor-pointer bg-white rounded-md font-medium text-theme-nature hover:text-theme-nature/90">
                              Upload Tax Exemption Certificate
                            </span>
                          </div>
                          <p className="text-xs text-gray-500">PNG, JPG, JPEG up to 10MB</p>
                        </div>
                      </button>
                    )}
                  </CldUploadWidget>
                )}
                {errors.taxExemptionCertificateUrl && (
                  <p className="mt-1 text-sm text-theme-heart">{errors.taxExemptionCertificateUrl.message}</p>
                )}
              </div>
            </div>
          </motion.div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="w-full">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-center text-gray-900 dark:text-white">NGO Registration</h2>
        <p className="mt-2 text-center text-gray-600 dark:text-gray-400">Complete the form below to register your NGO with Pashurakshak</p>
        {mounted && renderProgressBar()}
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        {mounted && renderStepContent()}

        <div className="flex justify-between pt-5">
          <button
            type="button"
            onClick={prevStep}
            disabled={currentStep === 1}
            className="bg-white dark:bg-card-dark py-2 px-4 border border-secondary-300 dark:border-border-dark rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-muted-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-theme-nature dark:focus:ring-theme-heart disabled:opacity-50"
          >
            Previous
          </button>

          {currentStep < totalSteps ? (
            <button
              type="button"
              onClick={nextStep}
              className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-gradient-to-r from-theme-nature to-primary-500 hover:from-theme-nature/90 hover:to-primary-600 dark:from-theme-heart dark:to-theme-paw dark:hover:from-theme-heart/90 dark:hover:to-theme-paw/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-theme-nature dark:focus:ring-theme-heart transition-all duration-200"
            >
              Next
            </button>
          ) : (
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-32 px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gradient-to-r from-theme-nature to-primary-500 hover:from-theme-nature/90 hover:to-primary-600 dark:from-theme-heart dark:to-theme-paw dark:hover:from-theme-heart/90 dark:hover:to-theme-paw/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-theme-nature dark:focus:ring-theme-heart transition-all duration-200 disabled:opacity-50"
            >
              {isSubmitting ? 'Submitting...' : 'Submit'}
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default RegistrationForm; 