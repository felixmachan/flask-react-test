import React from 'react';

function Appointments() {
    return (
        <div className="container-fluid">
            <div className="row justify-content-center align-items-center vh-100">
                <div className="col-md-6 text-center">
                    <h1 className="display-4">Időpontfoglalás</h1>
                    <p className="lead">Kérlek, válaszd ki a kívánt időpontot!</p>
                    {/* Itt lehetne egy időpontválasztó komponenst elhelyezni */}
                </div>
            </div>
        </div>
    );
}

export default Appointments;