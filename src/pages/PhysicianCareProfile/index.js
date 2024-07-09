import React from 'react'
import PatientOpportunityMapping from '../Output/PatientOpportunityMapping'
import EligiblePatientLocator from '../Output/EligiblePatientLocator'
import MedicalAffairToolbox from '../Output/MedicalAffairsToolbox'

const PhysicianCareProfile = () => {
  return (
    <div className='w-full flex  flex-col items-start gap-12'>
        <PatientOpportunityMapping />
        <EligiblePatientLocator />
        <MedicalAffairToolbox />
    </div>
  )
}

export default PhysicianCareProfile