'use client';

import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import { motion, Variants } from 'framer-motion';
import { toast } from 'react-hot-toast';
import { useRouter } from 'next/navigation';

interface RegistrationFormData {
  name: string;
  email: string;
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
  registrationCertificate: File | null;
  taxExemptionCertificate: File | null;
  district?: string;
  address?: string;
  phone?: string;
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
    registrationCertificate?: string;
    taxExemptionCertificate?: string;
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
  const { register, handleSubmit, formState: { errors }, watch } = useForm<RegistrationFormData>();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 5;
  const [mounted, setMounted] = useState(false);
  const [formData, setFormData] = useState<RegistrationFormData>({
    name: '',
    email: '',
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
    registrationCertificate: null,
    taxExemptionCertificate: null
  });
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, fieldName: keyof RegistrationFormData) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
        setFormData(prev => ({
          ...prev,
        [fieldName]: file
        }));
    }
  };

  const onSubmit = async (data: RegistrationFormData) => {
    try {
      setIsSubmitting(true);
      const apiUrl = process.env.NEXT_PUBLIC_API_URL;

      // Create the request body according to the API documentation
      const requestBody: NGORegistrationRequest = {
        name: data.name,
        email: data.email,
        password: "defaultPassword123", // You may want to add password field to the form
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
        documents: {}
      };

      // Add documents if available
      if (data.registrationCertificate) {
        // For actual implementation, you'll need to upload to Cloudinary first
        // and then use the returned URL
        requestBody.documents.registrationCertificate = "https://res.cloudinary.com/pashurakshak/image/upload/v1234567890/certificates/registration_cert.png";
      }
      
      if (data.taxExemptionCertificate) {
        requestBody.documents.taxExemptionCertificate = "https://res.cloudinary.com/pashurakshak/image/upload/v1234567890/certificates/tax_cert.png";
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

  const nextStep = () => setCurrentStep(prev => Math.min(prev + 1, totalSteps));
  const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 1));

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
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">NGO Name</label>
                <input
                  type="text"
                  {...register('name', { required: 'NGO name is required' })}
                  className="mt-1 block w-full rounded-md border-secondary-300 dark:border-border-dark bg-white dark:bg-card-dark shadow-sm focus:border-theme-nature dark:focus:border-theme-heart focus:ring-theme-nature dark:focus:ring-theme-heart sm:text-sm"
                />
                {errors.name && <p className="mt-1 text-sm text-theme-heart">{errors.name.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Email</label>
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
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Contact Person Name</label>
                <input
                  type="text"
                  {...register('contactPersonName', { required: 'Contact person name is required' })}
                  className="mt-1 block w-full rounded-md border-secondary-300 dark:border-border-dark bg-white dark:bg-card-dark shadow-sm focus:border-theme-nature dark:focus:border-theme-heart focus:ring-theme-nature dark:focus:ring-theme-heart sm:text-sm"
                />
                {errors.contactPersonName && <p className="mt-1 text-sm text-theme-heart">{errors.contactPersonName.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Contact Person Phone</label>
                <input
                  type="tel"
                  {...register('contactPersonPhone', { required: 'Contact person phone is required' })}
                  className="mt-1 block w-full rounded-md border-secondary-300 dark:border-border-dark bg-white dark:bg-card-dark shadow-sm focus:border-theme-nature dark:focus:border-theme-heart focus:ring-theme-nature dark:focus:ring-theme-heart sm:text-sm"
                />
                {errors.contactPersonPhone && <p className="mt-1 text-sm text-theme-heart">{errors.contactPersonPhone.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Contact Person Email</label>
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

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Organization Type</label>
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
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Registration Number</label>
                <input
                  type="text"
                  {...register('registrationNumber', { required: 'Registration number is required' })}
                  className="mt-1 block w-full rounded-md border-secondary-300 dark:border-border-dark bg-white dark:bg-card-dark shadow-sm focus:border-theme-nature dark:focus:border-theme-heart focus:ring-theme-nature dark:focus:ring-theme-heart sm:text-sm"
                />
                {errors.registrationNumber && <p className="mt-1 text-sm text-theme-heart">{errors.registrationNumber.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Street Address</label>
                <input
                  type="text"
                  {...register('street', { required: 'Street address is required' })}
                  className="mt-1 block w-full rounded-md border-secondary-300 dark:border-border-dark bg-white dark:bg-card-dark shadow-sm focus:border-theme-nature dark:focus:border-theme-heart focus:ring-theme-nature dark:focus:ring-theme-heart sm:text-sm"
                />
                {errors.street && <p className="mt-1 text-sm text-theme-heart">{errors.street.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">City</label>
                <input
                  type="text"
                  {...register('city', { required: 'City is required' })}
                  className="mt-1 block w-full rounded-md border-secondary-300 dark:border-border-dark bg-white dark:bg-card-dark shadow-sm focus:border-theme-nature dark:focus:border-theme-heart focus:ring-theme-nature dark:focus:ring-theme-heart sm:text-sm"
                />
                {errors.city && <p className="mt-1 text-sm text-theme-heart">{errors.city.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">State</label>
                <input
                  type="text"
                  {...register('state', { required: 'State is required' })}
                  className="mt-1 block w-full rounded-md border-secondary-300 dark:border-border-dark bg-white dark:bg-card-dark shadow-sm focus:border-theme-nature dark:focus:border-theme-heart focus:ring-theme-nature dark:focus:ring-theme-heart sm:text-sm"
                />
                {errors.state && <p className="mt-1 text-sm text-theme-heart">{errors.state.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Pincode</label>
                <input
                  type="text"
                  {...register('pincode', { required: 'Pincode is required' })}
                  className="mt-1 block w-full rounded-md border-secondary-300 dark:border-border-dark bg-white dark:bg-card-dark shadow-sm focus:border-theme-nature dark:focus:border-theme-heart focus:ring-theme-nature dark:focus:ring-theme-heart sm:text-sm"
                />
                {errors.pincode && <p className="mt-1 text-sm text-theme-heart">{errors.pincode.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Website (Optional)</label>
                <input
                  type="url"
                  {...register('website')}
                  className="mt-1 block w-full rounded-md border-secondary-300 dark:border-border-dark bg-white dark:bg-card-dark shadow-sm focus:border-theme-nature dark:focus:border-theme-heart focus:ring-theme-nature dark:focus:ring-theme-heart sm:text-sm"
                />
                {errors.website && <p className="mt-1 text-sm text-theme-heart">{errors.website.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Registration Certificate</label>
                <input
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png"
                  {...register('registrationCertificate', { required: 'Registration certificate is required' })}
                  className="mt-1 block w-full"
                />
                {errors.registrationCertificate && <p className="mt-1 text-sm text-theme-heart">{errors.registrationCertificate.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Tax Exemption Certificate (Optional)</label>
                <input
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png"
                  {...register('taxExemptionCertificate')}
                  className="mt-1 block w-full"
                />
                {errors.taxExemptionCertificate && <p className="mt-1 text-sm text-theme-heart">{errors.taxExemptionCertificate.message}</p>}
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
            <h3 className="text-xl font-semibold bg-gradient-to-r from-theme-nature via-primary-500 to-theme-heart bg-clip-text text-transparent dark:from-theme-paw dark:via-theme-sky dark:to-theme-heart">Location Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">State</label>
                <select
                  {...register('state', { required: 'State is required' })}
                  className="mt-1 block w-full rounded-md border-secondary-300 dark:border-border-dark bg-white dark:bg-card-dark shadow-sm focus:border-theme-nature focus:ring-theme-nature dark:focus:border-theme-heart dark:focus:ring-theme-heart transition-all"
                >
                  <option value="">Select State</option>
                  <option value="Maharashtra">Maharashtra</option>
                  <option value="Delhi">Delhi</option>
                  {/* Add more states */}
                </select>
                {errors.state && <p className="mt-1 text-sm text-theme-heart">{errors.state.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">District</label>
                <input
                  type="text"
                  {...register('district', { required: 'District is required' })}
                  className="mt-1 block w-full rounded-md border-secondary-300 dark:border-border-dark bg-white dark:bg-card-dark shadow-sm focus:border-theme-nature focus:ring-theme-nature dark:focus:border-theme-heart dark:focus:ring-theme-heart transition-all"
                  placeholder="Enter district"
                />
                {errors.district && <p className="mt-1 text-sm text-theme-heart">{errors.district.message}</p>}
              </div>

              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Address</label>
                <textarea
                  {...register('address', { required: 'Address is required' })}
                  rows={3}
                  className="mt-1 block w-full rounded-md border-secondary-300 dark:border-border-dark bg-white dark:bg-card-dark shadow-sm focus:border-theme-nature focus:ring-theme-nature dark:focus:border-theme-heart dark:focus:ring-theme-heart transition-all"
                  placeholder="Enter complete address"
                />
                {errors.address && <p className="mt-1 text-sm text-theme-heart">{errors.address.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Pincode</label>
                <input
                  type="text"
                  {...register('pincode', {
                    required: 'Pincode is required',
                    pattern: { value: /^\d{6}$/, message: 'Enter valid 6-digit pincode' }
                  })}
                  className="mt-1 block w-full rounded-md border-secondary-300 dark:border-border-dark bg-white dark:bg-card-dark shadow-sm focus:border-theme-nature focus:ring-theme-nature dark:focus:border-theme-heart dark:focus:ring-theme-heart transition-all"
                  placeholder="Enter pincode"
                />
                {errors.pincode && <p className="mt-1 text-sm text-theme-heart">{errors.pincode.message}</p>}
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
            <h3 className="text-xl font-semibold bg-gradient-to-r from-theme-nature via-primary-500 to-theme-heart bg-clip-text text-transparent dark:from-theme-paw dark:via-theme-sky dark:to-theme-heart">Contact Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Email</label>
                <input
                  type="email"
                  {...register('email', {
                    required: 'Email is required',
                    pattern: { value: /^\S+@\S+\.\S+$/, message: 'Enter valid email' }
                  })}
                  className="mt-1 block w-full rounded-md border-secondary-300 dark:border-border-dark bg-white dark:bg-card-dark shadow-sm focus:border-theme-nature focus:ring-theme-nature dark:focus:border-theme-heart dark:focus:ring-theme-heart transition-all"
                  placeholder="Enter email address"
                />
                {errors.email && <p className="mt-1 text-sm text-theme-heart">{errors.email.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Phone</label>
                <input
                  type="tel"
                  {...register('phone', {
                    required: 'Phone is required',
                    pattern: { value: /^[0-9]{10}$/, message: 'Enter valid 10-digit phone number' }
                  })}
                  className="mt-1 block w-full rounded-md border-secondary-300 dark:border-border-dark bg-white dark:bg-card-dark shadow-sm focus:border-theme-nature focus:ring-theme-nature dark:focus:border-theme-heart dark:focus:ring-theme-heart transition-all"
                  placeholder="Enter phone number"
                />
                {errors.phone && <p className="mt-1 text-sm text-theme-heart">{errors.phone.message}</p>}
              </div>
            </div>

            <h4 className="text-lg font-medium text-gray-900 mt-8">Contact Person Details</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Name</label>
                <input
                  type="text"
                  {...register('contactPersonName', { required: 'Contact person name is required' })}
                  className="mt-1 block w-full rounded-md border-secondary-300 dark:border-border-dark bg-white dark:bg-card-dark shadow-sm focus:border-theme-nature focus:ring-theme-nature dark:focus:border-theme-heart dark:focus:ring-theme-heart transition-all"
                  placeholder="Enter contact person name"
                />
                {errors.contactPersonName && <p className="mt-1 text-sm text-theme-heart">{errors.contactPersonName.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Designation</label>
                <input
                  type="text"
                  className="mt-1 block w-full rounded-md border-secondary-300 dark:border-border-dark bg-white dark:bg-card-dark shadow-sm focus:border-theme-nature focus:ring-theme-nature dark:focus:border-theme-heart dark:focus:ring-theme-heart transition-all"
                  placeholder="Enter designation"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Phone</label>
                <input
                  type="tel"
                  {...register('contactPersonPhone', {
                    required: 'Contact person phone is required',
                    pattern: { value: /^[0-9]{10}$/, message: 'Enter valid 10-digit phone number' }
                  })}
                  className="mt-1 block w-full rounded-md border-secondary-300 dark:border-border-dark bg-white dark:bg-card-dark shadow-sm focus:border-theme-nature focus:ring-theme-nature dark:focus:border-theme-heart dark:focus:ring-theme-heart transition-all"
                  placeholder="Enter contact person phone"
                />
                {errors.contactPersonPhone && <p className="mt-1 text-sm text-theme-heart">{errors.contactPersonPhone.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Email</label>
                <input
                  type="email"
                  {...register('contactPersonEmail', {
                    required: 'Contact person email is required',
                    pattern: { value: /^\S+@\S+\.\S+$/, message: 'Enter valid email' }
                  })}
                  className="mt-1 block w-full rounded-md border-secondary-300 dark:border-border-dark bg-white dark:bg-card-dark shadow-sm focus:border-theme-nature focus:ring-theme-nature dark:focus:border-theme-heart dark:focus:ring-theme-heart transition-all"
                  placeholder="Enter contact person email"
                />
                {errors.contactPersonEmail && <p className="mt-1 text-sm text-theme-heart">{errors.contactPersonEmail.message}</p>}
              </div>
            </div>
          </motion.div>
        );

      case 4:
        return (
          <motion.div
            variants={variants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="space-y-6"
          >
            <h3 className="text-xl font-semibold bg-gradient-to-r from-theme-nature via-primary-500 to-theme-heart bg-clip-text text-transparent dark:from-theme-paw dark:via-theme-sky dark:to-theme-heart">Organization Type & Focus Areas</h3>
            <div className="grid grid-cols-1 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Organization Type</label>
                <select
                  {...register('organizationType', { required: 'Organization type is required' })}
                  className="mt-1 block w-full rounded-md border-secondary-300 dark:border-border-dark bg-white dark:bg-card-dark shadow-sm focus:border-theme-nature focus:ring-theme-nature dark:focus:border-theme-heart dark:focus:ring-theme-heart transition-all"
                >
                  <option value="">Select Type</option>
                  <option value="Animal Welfare">Animal Welfare</option>
                  <option value="Wildlife Conservation">Wildlife Conservation</option>
                  <option value="Pet Adoption">Pet Adoption</option>
                  <option value="Other">Other</option>
                </select>
                {errors.organizationType && <p className="mt-1 text-sm text-theme-heart">{errors.organizationType.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Focus Areas</label>
                <div className="mt-2 space-y-2">
                  {['Animal Welfare', 'Wildlife Conservation', 'Pet Adoption', 'Other'].map((area) => (
                    <label key={area} className="inline-flex items-center mr-6">
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
            </div>
          </motion.div>
        );

      case 5:
        return (
          <motion.div
            variants={variants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="space-y-6"
          >
            <h3 className="text-xl font-semibold bg-gradient-to-r from-theme-nature via-primary-500 to-theme-heart bg-clip-text text-transparent dark:from-theme-paw dark:via-theme-sky dark:to-theme-heart">Document Upload</h3>
            <div className="grid grid-cols-1 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Registration Certificate</label>
                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-secondary-300 dark:border-border-dark bg-white dark:bg-card-dark rounded-md">
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
                    <div className="flex text-sm text-gray-600">
                      <label
                        htmlFor="registration-certificate"
                        className="relative cursor-pointer bg-white rounded-md font-medium text-theme-nature hover:text-theme-nature/90 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-theme-nature"
                      >
                        <span>Upload a file</span>
                        <input
                          id="registration-certificate"
                          type="file"
                          className="sr-only"
                          onChange={(e) => handleFileChange(e, 'registrationCertificate')}
                        />
                      </label>
                      <p className="pl-1">or drag and drop</p>
                    </div>
                    <p className="text-xs text-gray-500">PDF up to 10MB</p>
                  </div>
                </div>
                {errors.registrationCertificate && (
                  <p className="mt-1 text-sm text-theme-heart">{errors.registrationCertificate.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">PAN Card</label>
                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-secondary-300 dark:border-border-dark bg-white dark:bg-card-dark rounded-md">
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
                    <div className="flex text-sm text-gray-600">
                      <label
                        htmlFor="pan-card"
                        className="relative cursor-pointer bg-white rounded-md font-medium text-theme-nature hover:text-theme-nature/90 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-theme-nature"
                      >
                        <span>Upload a file</span>
                        <input
                          id="pan-card"
                          type="file"
                          className="sr-only"
                          onChange={(e) => handleFileChange(e, 'taxExemptionCertificate')}
                        />
                      </label>
                      <p className="pl-1">or drag and drop</p>
                    </div>
                    <p className="text-xs text-gray-500">PDF up to 10MB</p>
                  </div>
                </div>
                {errors.taxExemptionCertificate && <p className="mt-1 text-sm text-theme-heart">{errors.taxExemptionCertificate.message}</p>}
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
        <h2 className="text-2xl font-bold text-center text-gray-900">NGO Registration</h2>
        <p className="mt-2 text-center text-gray-600">Complete the form below to register your NGO</p>
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