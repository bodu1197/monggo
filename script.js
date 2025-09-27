import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm'

const SUPABASE_URL = 'https://rqfbuzbgzqgzowfzkpha.supabase.co'
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJxZmJ1emJnenFnem93ZnprcGhhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg1OTMzNTUsImV4cCI6MjA3NDE2OTM1NX0.Pj73nYc4Jq43YzBAIMu83MIh0BOoHRYHScUAXjIvFJI'

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

document.addEventListener('DOMContentLoaded', () => {
    const provinceSelect = document.getElementById('province-select');
    const regencySelect = document.getElementById('regency-select');
    const districtSelect = document.getElementById('district-select');

    const selectedProvincePara = document.getElementById('selected-province');
    const selectedRegencyPara = document.getElementById('selected-regency');
    const selectedDistrictPara = document.getElementById('selected-district');

    let provincesData = [];
    let regenciesData = [];
    let districtsData = [];

    // Function to fetch data from Supabase
    async function fetchSupabaseData(tableName, filterColumn = null, filterValue = null) {
        let query = supabase.from(tableName).select('*');
        if (filterColumn && filterValue) {
            query = query.eq(filterColumn, filterValue);
        }
        const { data, error } = await query;
        if (error) {
            console.error(`Error fetching ${tableName}:`, error);
            return [];
        }
        return data;
    }

    // Populate provinces dropdown
    async function populateProvinces() {
        provincesData = await fetchSupabaseData('provinces');
        provinceSelect.innerHTML = '<option value="">Select a Province</option>';
        provincesData.forEach(province => {
            const option = document.createElement('option');
            option.value = province.province_id;
            option.textContent = province.province_name;
            provinceSelect.appendChild(option);
        });
    }

    // Populate regencies dropdown based on selected province
    async function populateRegencies(provinceId) {
        regencySelect.innerHTML = '<option value="">Select a Regency</option>';
        if (provinceId) {
            regenciesData = await fetchSupabaseData('regencies', 'province_id', provinceId);
            regenciesData.forEach(regency => {
                const option = document.createElement('option');
                option.value = regency.regency_id;
                option.textContent = regency.regency_name;
                regencySelect.appendChild(option);
            });
        }
        regencySelect.disabled = !provinceId;
        districtSelect.innerHTML = '<option value="">Select a District</option>';
        districtSelect.disabled = true;
        selectedRegencyPara.textContent = 'Regency: None';
        selectedDistrictPara.textContent = 'District: None';
    }

    // Populate districts dropdown based on selected regency
    async function populateDistricts(regencyId) {
        districtSelect.innerHTML = '<option value="">Select a District</option>';
        if (regencyId) {
            districtsData = await fetchSupabaseData('districts', 'regency_id', regencyId);
            districtsData.forEach(district => {
                const option = document.createElement('option');
                option.value = district.district_id;
                option.textContent = district.district_name;
                districtSelect.appendChild(option);
            });
        }
        districtSelect.disabled = !regencyId;
        selectedDistrictPara.textContent = 'District: None';
    }

    // Event Listeners
    provinceSelect.addEventListener('change', (event) => {
        const selectedProvinceId = event.target.value;
        const selectedProvinceName = event.target.options[event.target.selectedIndex].textContent;
        selectedProvincePara.textContent = `Province: ${selectedProvinceName || 'None'}`;
        populateRegencies(selectedProvinceId);
    });

    regencySelect.addEventListener('change', (event) => {
        const selectedRegencyId = event.target.value;
        const selectedRegencyName = event.target.options[event.target.selectedIndex].textContent;
        selectedRegencyPara.textContent = `Regency: ${selectedRegencyName || 'None'}`;
        populateDistricts(selectedRegencyId);
    });

    districtSelect.addEventListener('change', (event) => {
        const selectedDistrictName = event.target.options[event.target.selectedIndex].textContent;
        selectedDistrictPara.textContent = `District: ${selectedDistrictName || 'None'}`;
    });

    // Initial load
    populateProvinces();
});
