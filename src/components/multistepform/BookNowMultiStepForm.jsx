import React, { useState } from "react";

import StepSidebar from "./StepSidebar";

import Step1Personal from "./steps/Step1Personal";
import Step2Documents from "./steps/Step2Documents";
import Step3Payment from "./steps/Step3Payment";
import Step4Office from "./steps/Step4Office";
import Step5Summary from "./steps/Step5Summary";
import FranchiseDetails from "./steps/FranchiseDetails";

export default function BookNowMultiStepForm() {

    const [step, setStep] = useState(1);

    const [formData, setFormData] = useState({
        franchiseType: "",
        state: "",
        territory: "",
        district: "",
        city: "",
        pin: "",

        name: "",
        email: "",
        phone: "",
        altPhone: "",
        streetAddress: "",
        officeBranch: "",
        bda: "",
        bde: "",
        bdm: "",
        bdaName: "",
        bdeName: "",
        bdmName: "",
        leadSource: "",
        gst: "",
        dealAmount: "",
        tokenReceivedAmount: "",
        receivedPercent: "",
        remainPercent: "",
        balanceAmount: "",
        tokenDate: "",
        modeOfPayment: "",
        proofOfPayment: "",
        additionalCommitment: "",
        remark: "",
        adharImages: [],
        panImage: null,
        companyPanImage: null,
        addressProof: null,
    });

    const next = () => setStep((s) => s + 1);
    const prev = () => setStep((s) => s - 1);

    return (
        <div
            className="w-full min-h-screen bg-[#e8f3fb] flex flex-col md:flex-row"
            style={{ paddingTop: "9vh" }}
        >

            <StepSidebar step={step} />

            <div className="flex-1 flex justify-center p-6 md:p-10">
                <div className="bg-white shadow-xl border rounded-2xl w-full max-w-3xl p-8">

                    {step === 1 && (
                        <FranchiseDetails
                            formData={formData}
                            setFormData={setFormData}
                            next={next}
                        />
                    )}

                    {step === 2 && (
                        <Step1Personal
                            formData={formData}
                            setFormData={setFormData}
                            prev={prev}
                            next={next}
                        />
                    )}

                    {step === 3 && (
                        <Step2Documents
                            formData={formData}
                            setFormData={setFormData}
                            next={next}
                            prev={prev}
                        />
                    )}

                    {step === 4 && (
                        <Step3Payment
                            formData={formData}
                            setFormData={setFormData}
                            next={next}
                            prev={prev}
                        />
                    )}

                    {step === 5 && (
                        <Step4Office
                            formData={formData}
                            setFormData={setFormData}
                            next={next}
                            prev={prev}
                        />
                    )}

                    {step === 6 && (
                        <Step5Summary
                            formData={formData}
                            prev={prev}
                        />
                    )}

                </div>
            </div>
        </div>
    );
}
