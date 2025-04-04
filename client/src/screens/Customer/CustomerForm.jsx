import countryDataSet from '@data/countryDataSet';
import countryPhoneCode from '@data/countryPhoneCode';
import { useEffect, useState } from 'react';
import {
  BanknotesIcon,
  DocumentTextIcon,
  TruckIcon,
  UserCircleIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';
import { toast } from 'react-toastify';
import PropTypes from 'prop-types';
import SelectWithSearch from '@components/SelectWithSearch';

const CustomerForm = ({
  showForm,
  setShowForm,
  handleSubmitData,
  initinalData,
  setInitinalData,
  addCustomerLoading,
  updateCustomerLoading,
}) => {
  // Forms UseState
  const [customerType, setCustomerType] = useState('');
  const [salutation, setSalutation] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [workPhoneCountryCode, setWorkPhoneCountryCode] = useState('+91');
  const [workPhone, setWorkPhone] = useState('');
  const [mobileCountryCode, setMobileCountryCode] = useState('+91');
  const [mobile, setMobile] = useState('');
  const [businessLegalName, setBusinessLegalName] = useState('');
  const [gstNumber, setGstNumber] = useState('');
  const [placeOfSupply, setPlaceOfSupply] = useState('Maharashtra');

  const [billingCountry, setBillingCountry] = useState('');
  const [billingState, setBillingState] = useState('');
  const [billingCity, setBillingCity] = useState('');
  const [billingZipcode, setBillingZipcode] = useState('');
  const [billingAddress, setBillingAddress] = useState('');

  const [shippingCountry, setShippingCountry] = useState('');
  const [shippingState, setShippingState] = useState('');
  const [shippingCity, setShippingCity] = useState('');
  const [shippingZipcode, setShippingZipcode] = useState('');
  const [shippingAddress, setShippingAddress] = useState('');

  // Handle Close Form
  const handleCloseForm = () => {
    setShowForm(false);
    if (initinalData) {
      setInitinalData(null);
    }
  };

  const checkMobileNumber = (setterFunction, value) => {
    if (/^\d{0,10}$/.test(value)) {
      setterFunction(value);
    }
  };

  const checkPincode = (setterFunction, value) => {
    if (/^\d{0,6}$/.test(value)) {
      setterFunction(value);
    }
  };

  const getCountries = () => {
    return countryDataSet.map((countries) => countries.country);
  };

  const getStates = (country) => {
    const countryObj = countryDataSet.find(
      (countries) => countries.country == country
    );

    return countryObj
      ? countryObj.states.map((stateObj) => stateObj.state)
      : [];
  };

  const getCities = (country, state) => {
    const countryObj = countryDataSet.find(
      (countries) => countries.country == country
    );

    if (!countryObj) return [];

    const stateData = countryObj.states.find(
      (stateObj) => stateObj.state === state
    );

    return stateData ? stateData.cities : [];
  };

  const handleSameBillingAddress = (e) => {
    if (e.target.checked) {
      setShippingCountry(billingCountry);
      setShippingState(billingState);
      setShippingCity(billingCity);
      setShippingZipcode(billingZipcode);
      setShippingAddress(billingAddress);
    }
  };

  const fillInitinalData = (data) => {
    setCustomerType(data.customerType);
    setSalutation(data.salutation);
    setFirstName(data.firstName);
    setLastName(data.lastName);
    setEmail(data.email);
    setWorkPhoneCountryCode(data.workPhone.split(' ')[0]);
    setWorkPhone(data.workPhone.split(' ')[1]);
    setMobileCountryCode(data.mobile.split(' ')[0]);
    setMobile(data.mobile.split(' ')[1]);
    setBusinessLegalName(data.businessLegalName);
    setGstNumber(data.gstNumber);
    setPlaceOfSupply(data.placeOfSupply);
    setBillingCountry(data.billingCountry);
    setBillingState(data.billingState);
    setBillingCity(data.billingCity);
    setBillingAddress(data.billingAddress);
    setBillingZipcode(data.billingZipcode);

    setShippingCountry(data.shippingCountry);
    setShippingState(data.shippingState);
    setShippingCity(data.shippingCity);
    setShippingAddress(data.shippingAddress);
    setShippingZipcode(data.shippingZipcode);
  };

  const clearForm = () => {
    setCustomerType('');
    setSalutation('');
    setFirstName('');
    setLastName('');
    setEmail('');
    setWorkPhoneCountryCode('+91');
    setWorkPhone('');
    setMobileCountryCode('+91');
    setMobile('');
    setBusinessLegalName('');
    setGstNumber('');
    setPlaceOfSupply('Maharashtra');

    setBillingCountry('');
    setBillingState('');
    setBillingCity('');
    setBillingZipcode('');
    setBillingAddress('');

    setShippingCountry('');
    setShippingState('');
    setShippingCity('');
    setShippingZipcode('');
    setShippingAddress('');
  };

  const handleVerifyData = (e) => {
    e.preventDefault();

    if (!customerType) {
      return toast.error('Select Customer Type');
    }

    if (!/^[a-zA-Z]+$/.test(salutation)) {
      return toast.error('Select Valid Saluation');
    }

    if (!/^[a-zA-Z]+$/.test(firstName)) {
      return toast.error('Invalid First Name');
    }

    if (!/^[a-zA-Z]+$/.test(lastName)) {
      return toast.error('Invalid Last Name');
    }

    if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email)) {
      return toast.error('Enter Valid Email');
    }

    if (!/^\+\d{1,4}(-\d{1,4})?$/.test(workPhoneCountryCode)) {
      return toast.error('Enter Valid WorkPhone Country Code');
    }

    if (!/^\d{10}$/.test(workPhone)) {
      return toast.error('Enter Valid Work Phone');
    }

    if (!/^\+\d{1,4}(-\d{1,4})?$/.test(mobileCountryCode)) {
      return toast.error('Enter Valid Mobile Country Code');
    }

    if (!/^\d{10}$/.test(mobile)) {
      return toast.error('Enter Valid Mobile Phone');
    }

    if (
      customerType === 'Business' &&
      !/^[a-zA-Z0-9\s]+$/.test(businessLegalName)
    ) {
      return toast.error('Invalid Business Legal Name');
    }

    if (
      customerType === 'Business' &&
      !/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}[Z]{1}[0-9A-Z]{1}$/.test(
        gstNumber
      )
    ) {
      return toast.error('Invalid GSTIN Number');
    }

    if (!/^[^\s\d][^\d]*[^\s\d]$|^[^\s\d]$/.test(placeOfSupply)) {
      return toast.error('Select Valid Place Of Supply Number');
    }

    if (!billingAddress) {
      return toast.error('Enter Valid Shipping Address');
    }

    if (!/^[^\s\d][^\d]*[^\s\d]$|^[^\s\d]$/.test(billingCountry)) {
      return toast.error('Select Valid Billing Country');
    }

    if (!/^[^\s\d][^\d]*[^\s\d]$|^[^\s\d]$/.test(billingState)) {
      return toast.error('Select Valid Billing State');
    }

    if (!/^[^\s\d][^\d]*[^\s\d]$|^[^\s\d]$/.test(billingCity)) {
      return toast.error('Select Valid Billing City');
    }

    if (!/^\d{5,6}$/.test(billingZipcode)) {
      return toast.error('Enter Valid Billing Zipcode');
    }

    if (!shippingAddress) {
      return toast.error('Enter Valid Shipping Address');
    }

    if (!/^[^\s\d][^\d]*[^\s\d]$|^[^\s\d]$/.test(shippingCountry)) {
      return toast.error('Select Valid Billing Country');
    }

    if (!/^[^\s\d][^\d]*[^\s\d]$|^[^\s\d]$/.test(shippingState)) {
      return toast.error('Select Valid Billing State');
    }

    if (!/^[^\s\d][^\d]*[^\s\d]$|^[^\s\d]$/.test(shippingCity)) {
      return toast.error('Select Valid Billing City');
    }

    if (!/^\d{5,6}$/.test(shippingZipcode)) {
      return toast.error('Enter Valid Billing Zipcode');
    }

    const user = {
      customerType,
      salutation,
      firstName,
      lastName,
      email,
      workPhone: `${workPhoneCountryCode} ${workPhone}`,
      mobile: `${mobileCountryCode} ${mobile}`,
      businessLegalName,
      gstNumber,
      placeOfSupply,
      billingCountry,
      billingState,
      billingCity,
      billingAddress,
      billingZipcode,
      shippingCountry,
      shippingState,
      shippingCity,
      shippingAddress,
      shippingZipcode,
    };

    handleSubmitData(user);
  };

  useEffect(() => {
    if (customerType === 'Individual') {
      setBusinessLegalName('');
      setGstNumber('');
    }
  }, [customerType]);

  useEffect(() => {
    if (initinalData) {
      fillInitinalData(initinalData);
    } else {
      clearForm();
    }
  }, [initinalData, showForm]);

  return (
    <div
      className={`fixed px-6 transition-all duration-300 ${showForm ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0'} top-0 left-0 z-50 flex h-screen w-screen items-center justify-center bg-[rgb(0,0,0,0.5)]`}>
      <div className='relative z-50 flex h-[600px] w-[400px] flex-col rounded-md bg-white shadow-md md:w-[700px] lg:w-[800px]'>
        <p className='bg-wovBlue rounded-t-md py-5 text-center text-xl font-semibold text-white'>
          {initinalData ? 'Edit Customer' : 'Add New Customer'}
        </p>
        <div
          onClick={handleCloseForm}
          className='absolute top-0 right-0 w-fit -translate-y-1/2 translate-x-1/2 cursor-pointer rounded-full bg-white p-0.5'>
          <XMarkIcon className='size-5' />
        </div>

        <form
          onSubmit={handleVerifyData}
          className='scrollbar-none max-h-full w-full space-y-8 overflow-x-hidden overflow-y-scroll p-6'>
          {/* Customer Information */}
          <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
            <p className='grid-full text-wovBlue col-span-full mb-2 flex items-center gap-2 text-base font-semibold'>
              <UserCircleIcon className='size-5' /> Customer Information
            </p>

            <div className='customer-type'>
              <p className='mb-2 block text-sm leading-6 font-medium text-gray-900'>
                Customer Type
              </p>

              <div className='flex flex-wrap gap-2'>
                <div className='w-fit shrink-0 rounded-md bg-slate-100 px-2 py-1'>
                  <input
                    type='radio'
                    name='customerType'
                    id='business'
                    value='business'
                    checked={customerType === 'business'}
                    onChange={(e) => setCustomerType(e.target.value)}
                    className='mr-2 focus:ring-0 focus:outline-0 active:ring-0 active:outline-0'
                  />
                  <label htmlFor='business' className='cursor-pointer text-sm'>
                    Business
                  </label>
                </div>

                <div className='w-fit shrink-0 rounded-md bg-slate-100 px-2 py-1'>
                  <input
                    type='radio'
                    name='customerType'
                    id='individual'
                    value='individual'
                    checked={customerType === 'individual'}
                    onChange={(e) => setCustomerType(e.target.value)}
                    className='mr-2 focus:ring-0 focus:outline-0 active:ring-0 active:outline-0'
                  />
                  <label
                    htmlFor='individual'
                    className='cursor-pointer text-sm'>
                    Individual
                  </label>
                </div>
              </div>
            </div>

            <div className='name'>
              <label
                htmlFor='name'
                className='block text-sm leading-6 font-medium text-gray-900'>
                Name
              </label>

              <div className='mt-2 flex gap-2'>
                <SelectWithSearch
                  state={salutation}
                  setState={setSalutation}
                  list={['Mr', 'Mrs', 'Ms', 'Dr', 'Shree', 'Shri']}
                  placeholder='Saluation'
                />

                <input
                  id='name'
                  type='text'
                  placeholder='First Name'
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  onBlur={() => setFirstName(firstName.trim())}
                  className='block w-full rounded-md border-transparent bg-slate-100 px-3 py-1.5 text-sm placeholder:text-slate-400 hover:border-slate-400 focus:border-slate-400 focus:ring-0'
                />

                <input
                  id='name'
                  type='text'
                  placeholder='Last Name'
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  onBlur={() => setLastName(lastName.trim())}
                  className='block w-full rounded-md border-transparent bg-slate-100 px-3 py-1.5 text-sm placeholder:text-slate-400 hover:border-slate-400 focus:border-slate-400 focus:ring-0'
                />
              </div>
            </div>

            <div className='work-phone'>
              <label
                htmlFor='work-phone'
                className='block text-sm leading-6 font-medium text-gray-900'>
                Work Phone
              </label>

              <div className='mt-2 flex gap-2'>
                <SelectWithSearch
                  state={workPhoneCountryCode}
                  setState={setWorkPhoneCountryCode}
                  list={countryPhoneCode.map(({ code }) => code)}
                  placeholder='Country Code'
                />

                <input
                  id='work-phone'
                  type='text'
                  value={workPhone}
                  inputMode='numeric'
                  pattern='[0-9]*'
                  onChange={(e) =>
                    checkMobileNumber(setWorkPhone, e.target.value)
                  }
                  maxLength={10}
                  placeholder='Number'
                  className='block w-full rounded-md border-transparent bg-slate-100 px-3 py-1.5 text-sm placeholder:text-slate-400 hover:border-slate-400 focus:border-slate-400 focus:ring-0 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none'
                />
              </div>
            </div>

            <div className='mobile-phone'>
              <label
                htmlFor='mobile-phone'
                className='block text-sm leading-6 font-medium text-gray-900'>
                Mobile Phone
              </label>

              <div className='mt-2 flex gap-2'>
                <SelectWithSearch
                  state={mobileCountryCode}
                  setState={setMobileCountryCode}
                  list={countryPhoneCode.map(({ code }) => code)}
                  placeholder='Country Code'
                />
                <input
                  id='mobile-phone'
                  type='text'
                  value={mobile}
                  inputMode='numeric'
                  pattern='[0-9]*'
                  onChange={(e) => checkMobileNumber(setMobile, e.target.value)}
                  maxLength={10}
                  placeholder='Number'
                  className='block w-full grow rounded-md border-transparent bg-slate-100 px-3 py-1.5 text-sm placeholder:text-slate-400 hover:border-slate-400 focus:border-slate-400 focus:ring-0 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none'
                />
              </div>
            </div>

            <div className='email'>
              <label
                htmlFor='email'
                className='block text-sm leading-6 font-medium text-gray-900'>
                Customer Email
              </label>

              <div className='mt-2 flex gap-4'>
                <input
                  id='email'
                  type='text'
                  placeholder='xyz@email.com'
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onBlur={() => setEmail(email.trim())}
                  className='block w-full rounded-md border-transparent bg-slate-100 px-3 py-1.5 text-sm placeholder:text-slate-400 hover:border-slate-400 focus:border-slate-400 focus:ring-0'
                />
              </div>
            </div>
          </div>

          {/* Business Information */}
          <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
            <p className='grid-full text-wovBlue col-span-full mb-2 flex items-center gap-2 text-base font-semibold'>
              <BanknotesIcon className='size-5' />
              Business Information
            </p>

            {customerType === 'business' && (
              <>
                <div className='busniness-legal-name'>
                  <label
                    htmlFor='busniness-legal-name'
                    className='block text-sm leading-6 font-medium text-gray-900'>
                    Busniness Legal Name
                  </label>
                  <div className='mt-2 flex gap-4'>
                    <input
                      id='busniness-legal-name'
                      type='text'
                      placeholder='xyz Traders'
                      value={businessLegalName}
                      onChange={(e) => setBusinessLegalName(e.target.value)}
                      onBlur={() =>
                        setBusinessLegalName(businessLegalName.trim())
                      }
                      className='block w-full rounded-md border-transparent bg-slate-100 px-3 py-1.5 text-sm placeholder:text-slate-400 hover:border-slate-400 focus:border-slate-400 focus:ring-0'
                    />
                  </div>
                </div>

                <div className='gst-number'>
                  <label
                    htmlFor='gst-number'
                    className='block text-sm leading-6 font-medium text-gray-900'>
                    GSTIN
                  </label>
                  <div className='mt-2 flex gap-4'>
                    <input
                      id='gst-number'
                      type='text'
                      placeholder='GSTIN'
                      value={gstNumber}
                      onChange={(e) => setGstNumber(e.target.value)}
                      onBlur={() => setGstNumber(gstNumber.trim())}
                      className='block w-full rounded-md border-transparent bg-slate-100 px-3 py-1.5 text-sm placeholder:text-slate-400 hover:border-slate-400 focus:border-slate-400 focus:ring-0'
                    />
                  </div>
                </div>
              </>
            )}

            <div className='place-of-supply'>
              <label
                htmlFor='place-of-supply'
                className='block text-sm leading-6 font-medium text-gray-900'>
                Place Of Supply
              </label>

              <div className='mt-2 flex gap-4'>
                <SelectWithSearch
                  state={placeOfSupply}
                  setState={setPlaceOfSupply}
                  list={getStates('India')}
                  placeholder='Select Place Of Supply'
                />
              </div>
            </div>
          </div>

          {/* Billing Address */}
          <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
            <p className='grid-full text-wovBlue col-span-full mb-2 flex items-center gap-2 text-base font-semibold'>
              <DocumentTextIcon className='size-5' />
              Billing Address
            </p>

            <div className='billing-address col-span-full'>
              <label
                htmlFor='billing-address'
                className='block text-sm leading-6 font-medium text-gray-900'>
                Address
              </label>
              <div className='mt-2 flex gap-4'>
                <textarea
                  id='billing-address'
                  type='text'
                  placeholder='Enter Your Billing Address Here'
                  value={billingAddress}
                  onChange={(e) => setBillingAddress(e.target.value)}
                  onBlur={() => setBillingAddress(billingAddress.trim())}
                  className='block field-sizing-content w-full resize-none rounded-md border-transparent bg-slate-100 px-3 py-1.5 text-sm placeholder:text-slate-400 hover:border-slate-400 focus:border-slate-400 focus:ring-0'
                />
              </div>
            </div>

            <div className='billing-country'>
              <label
                htmlFor='billing-country'
                className='block text-sm leading-6 font-medium text-gray-900'>
                Country / Region
              </label>

              <div className='mt-2 flex gap-4'>
                <SelectWithSearch
                  state={billingCountry}
                  setState={setBillingCountry}
                  list={getCountries()}
                  placeholder='Select Country'
                />
              </div>
            </div>

            <div className='billing-state'>
              <label
                htmlFor='billing-state'
                className='block text-sm leading-6 font-medium text-gray-900'>
                State
              </label>

              <div className='mt-2 flex gap-4'>
                <SelectWithSearch
                  state={billingState}
                  setState={setBillingState}
                  list={getStates(billingCountry)}
                  placeholder='Select State'
                />
              </div>
            </div>

            <div className='billing-city'>
              <label
                htmlFor='billing-city'
                className='block text-sm leading-6 font-medium text-gray-900'>
                City
              </label>

              <div className='mt-2 flex gap-4'>
                <SelectWithSearch
                  state={billingCity}
                  setState={setBillingCity}
                  list={getCities(billingCountry, billingState)}
                  placeholder='Select City'
                />
              </div>
            </div>

            <div className='billing-zipcode'>
              <label
                htmlFor='billing-zipcode'
                className='block text-sm leading-6 font-medium text-gray-900'>
                ZipCode
              </label>

              <div className='mt-2 flex gap-2'>
                <input
                  id='billing-zipcode'
                  type='text'
                  value={billingZipcode}
                  inputMode='numeric'
                  placeholder='Enter Zipcode'
                  onChange={(e) =>
                    checkPincode(setBillingZipcode, e.target.value)
                  }
                  maxLength={6}
                  className='block w-full rounded-md border-transparent bg-slate-100 px-3 py-1.5 text-sm placeholder:text-slate-400 hover:border-slate-400 focus:border-slate-400 focus:ring-0 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none'
                />
              </div>
            </div>
          </div>

          {/* Shipping Address */}
          <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
            <p className='grid-full text-wovBlue col-span-full mb-2 flex items-center gap-2 text-base font-semibold'>
              <TruckIcon className='size-5 shrink-0' />
              Shipping Address
            </p>

            <div className='col-span-full mb-2 flex items-center gap-2'>
              <input
                type='checkbox'
                name=''
                id='same'
                onChange={handleSameBillingAddress}
                className='rounded-xs accent-black checked:ring-0 focus:ring-0'
              />
              <label
                htmlFor='same'
                className='text-wovBlue cursor-pointer text-sm select-none'>
                Billing Information Same As Shipping
              </label>
            </div>

            <div className='shipping-address col-span-full'>
              <label
                htmlFor='shipping-address'
                className='block text-sm leading-6 font-medium text-gray-900'>
                Address
              </label>
              <div className='mt-2 flex gap-4'>
                <textarea
                  id='shipping-address'
                  type='text'
                  placeholder='Enter Your Shipping Address Here'
                  value={shippingAddress}
                  onChange={(e) => setShippingAddress(e.target.value)}
                  onBlur={() => setShippingAddress(shippingAddress.trim())}
                  className='block field-sizing-content w-full resize-none rounded-md border-transparent bg-slate-100 px-3 py-1.5 text-sm placeholder:text-slate-400 hover:border-slate-400 focus:border-slate-400 focus:ring-0'
                />
              </div>
            </div>

            <div className='shipping-country'>
              <label
                htmlFor='shipping-country'
                className='block text-sm leading-6 font-medium text-gray-900'>
                Country / Region
              </label>

              <div className='mt-2 flex gap-4'>
                <SelectWithSearch
                  state={shippingCountry}
                  setState={setShippingCountry}
                  list={getCountries()}
                  placeholder='Select Country'
                  listPosition='top'
                />
              </div>
            </div>

            <div className='shipping-state'>
              <label
                htmlFor='shipping-state'
                className='block text-sm leading-6 font-medium text-gray-900'>
                State
              </label>

              <div className='mt-2 flex gap-4'>
                <SelectWithSearch
                  state={shippingState}
                  setState={setShippingState}
                  list={getStates(shippingCountry)}
                  placeholder='Select State'
                  listPosition='top'
                />
              </div>
            </div>

            <div className='shipping-city'>
              <label
                htmlFor='shipping-city'
                className='block text-sm leading-6 font-medium text-gray-900'>
                City
              </label>

              <div className='mt-2 flex gap-4'>
                <SelectWithSearch
                  state={shippingCity}
                  setState={setShippingCity}
                  list={getCities(shippingCountry, shippingState)}
                  placeholder='Select City'
                  listPosition='top'
                />
              </div>
            </div>

            <div className='shipping-zipcode'>
              <label
                htmlFor='shipping-zipcode'
                className='block text-sm leading-6 font-medium text-gray-900'>
                ZipCode
              </label>

              <div className='mt-2 flex gap-2'>
                <input
                  id='shipping-zipcode'
                  type='text'
                  value={shippingZipcode}
                  inputMode='numeric'
                  placeholder='Enter Zipcode'
                  onChange={(e) =>
                    checkPincode(setShippingZipcode, e.target.value)
                  }
                  maxLength={6}
                  className='block w-full rounded-md border-transparent bg-slate-100 px-3 py-1.5 text-sm placeholder:text-slate-400 hover:border-slate-400 focus:border-slate-400 focus:ring-0 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none'
                />
              </div>
            </div>
          </div>

          {/* Submitting Data */}
          <div className='flex items-center justify-end border-t border-slate-900/10'>
            <button
              disabled={addCustomerLoading || updateCustomerLoading}
              className='bg-wovBlue mt-8 w-full rounded-md px-4 py-2 text-white transition-transform active:scale-95 disabled:cursor-not-allowed disabled:opacity-80 sm:w-fit'>
              {initinalData
                ? updateCustomerLoading
                  ? 'Updating Customer...'
                  : 'Update Customer'
                : addCustomerLoading
                  ? 'Adding Customer...'
                  : 'Add Customer'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

CustomerForm.propTypes = {
  showForm: PropTypes.bool,
  setShowForm: PropTypes.func,
  handleSubmitData: PropTypes.func,
  initinalData: PropTypes.object,
  setInitinalData: PropTypes.func,
  addCustomerLoading: PropTypes.bool,
  updateCustomerLoading: PropTypes.bool,
};

export default CustomerForm;
