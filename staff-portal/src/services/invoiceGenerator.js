export function createInvoiceElement(data = {}) {
    // data: { id, patient, date, amount, mode, items, consultationFee, labCharges, medicineCharges, discount, paymentMode, total }
    const colors = {
        primary: '#0D9488',
        slate800: '#1e293b',
        slate700: '#334155',
        slate600: '#475569',
        slate500: '#64748b',
        slate400: '#94a3b8',
        slate200: '#e2e8f0',
        slate100: '#f1f5f9',
        slate50: '#f8fafc'
    };

    const container = document.createElement('div');
    container.style.width = '790px';
    container.style.padding = '48px';
    container.style.backgroundColor = 'white';
    container.style.fontFamily = 'sans-serif';
    container.style.border = `1px solid ${colors.slate200}`;
    container.style.borderRadius = '24px';

    const id = data.id || `INV-${Date.now()}`;
    const date = data.date || new Date().toLocaleDateString();
    const patient = data.patient || 'Patient Name';
    const mode = data.mode || data.paymentMode || 'Cash';
    const items = data.items || [];
    const consultationFee = Number(data.consultationFee || 0);
    const labCharges = Number(data.labCharges || 0);
    const medicineCharges = Number(data.medicineCharges || 0);
    const discount = Number(data.discount || 0);

    const itemsTotal = items.reduce((s, it) => s + Number(it.charge || 0), 0);
    const subtotal = consultationFee + labCharges + medicineCharges + itemsTotal;
    const discountAmount = (subtotal * discount) / 100;
    const taxable = subtotal - discountAmount;
    const tax = taxable * 0.18;
    const total = typeof data.total !== 'undefined' ? data.total : (taxable + tax);

    container.innerHTML = `
        <div style="background-color:${colors.slate800};padding:48px;color:white;border-top-left-radius:24px;border-top-right-radius:24px;margin:-48px -48px 48px -48px">
            <div style="display:flex;justify-content:space-between;align-items:flex-start">
                <div>
                    <div style="display:flex;align-items:center;gap:12px;margin-bottom:24px">
                        <div style="background-color:${colors.primary};width:48px;height:48px;border-radius:12px;display:flex;align-items:center;justify-content:center;color:white;font-size:24px;font-weight:900">C</div>
                        <div>
                            <h2 style="margin:0;font-size:24px;font-weight:900;text-transform:uppercase;font-style:italic">Clinixa</h2>
                            <p style="margin:0;font-size:10px;font-weight:900;color:${colors.primary};text-transform:uppercase;letter-spacing:0.2em">Healthcare Redefined</p>
                        </div>
                    </div>
                    <div style="font-size:14px;color:${colors.slate400}">
                        <p style="margin:0">45 Medical Square, Central Health City</p>
                        <p style="margin:4px 0">+91 9988776655</p>
                        <p style="margin:0">billing@clinixa.life</p>
                    </div>
                </div>
                <div style="text-align:right">
                    <h3 style="margin:0;font-size:36px;font-weight:900;text-transform:uppercase">Invoice</h3>
                    <p style="margin:8px 0 0 0;font-size:14px;font-weight:700;color:${colors.slate400}">DATE: <span style="color:white">${date}</span></p>
                </div>
            </div>
        </div>

        <div style="display:flex;justify-content:space-between;margin-bottom:48px;border-bottom:1px solid ${colors.slate100};padding-bottom:32px">
            <div>
                <span style="font-size:10px;font-weight:900;color:${colors.slate400};text-transform:uppercase;letter-spacing:0.2em;display:block;margin-bottom:12px">Bill To</span>
                <h4 style="margin:0;font-size:20px;font-weight:900;color:${colors.slate800}">${patient}</h4>
                <p style="margin:4px 0;font-size:14px;font-weight:700;color:${colors.primary}">${id}</p>
            </div>
            <div style="text-align:right">
                <span style="font-size:10px;font-weight:900;color:${colors.slate400};text-transform:uppercase;letter-spacing:0.2em;display:block;margin-bottom:12px">Payment Info</span>
                <p style="margin:0;font-size:14px;font-weight:700;color:${colors.slate800}">Mode: ${mode}</p>
                <p style="margin:4px 0;font-size:14px;color:${colors.slate500}">Status: Paid</p>
            </div>
        </div>

        <table style="width:100%;border-collapse:collapse;margin-bottom:48px">
            <thead>
                <tr style="border-bottom:2px solid ${colors.slate100}">
                    <th style="padding-bottom:16px;text-align:left;font-size:10px;font-weight:900;color:${colors.slate400};text-transform:uppercase">Description</th>
                    <th style="padding-bottom:16px;text-align:right;font-size:10px;font-weight:900;color:${colors.slate400};text-transform:uppercase">Amount</th>
                </tr>
            </thead>
            <tbody>
                ${consultationFee > 0 ? `<tr style="border-bottom:1px solid ${colors.slate100}"><td style="padding:20px 0;font-weight:700;color:${colors.slate700}">Consultation Fees</td><td style="padding:20px 0;text-align:right;font-weight:900;color:${colors.slate800}">₹${consultationFee.toLocaleString()}</td></tr>` : ''}
                ${labCharges > 0 ? `<tr style="border-bottom:1px solid ${colors.slate100}"><td style="padding:20px 0;font-weight:700;color:${colors.slate700}">Lab Charges</td><td style="padding:20px 0;text-align:right;font-weight:900;color:${colors.slate800}">₹${labCharges.toLocaleString()}</td></tr>` : ''}
                ${medicineCharges > 0 ? `<tr style="border-bottom:1px solid ${colors.slate100}"><td style="padding:20px 0;font-weight:700;color:${colors.slate700}">Medicine Charges</td><td style="padding:20px 0;text-align:right;font-weight:900;color:${colors.slate800}">₹${medicineCharges.toLocaleString()}</td></tr>` : ''}
                ${items.map(item => `
                    <tr style="border-bottom:1px solid ${colors.slate100}">
                        <td style="padding:20px 0;font-weight:700;color:${colors.slate700}">${item.service || ''}</td>
                        <td style="padding:20px 0;text-align:right;font-weight:900;color:${colors.slate800}">₹${Number(item.charge || 0).toLocaleString()}</td>
                    </tr>
                `).join('')}
            </tbody>
        </table>

        <div style="display:flex;justify-content:flex-end;margin-bottom:48px">
            <div style="width:280px;display:flex;flex-direction:column;gap:12px">
                <div style="display:flex;justify-content:space-between;font-size:14px;font-weight:700;color:${colors.slate500}"><span>Subtotal</span><span>₹${subtotal.toLocaleString()}</span></div>
                ${discount > 0 ? `<div style="display:flex;justify-content:space-between;font-size:14px;font-weight:700;color:${colors.primary}"><span>Discount (${discount}%)</span><span>-₹${discountAmount.toLocaleString()}</span></div>` : ''}
                <div style="display:flex;justify-content:space-between;font-size:14px;font-weight:700;color:${colors.slate500}"><span>GST (18%)</span><span>₹${tax.toLocaleString()}</span></div>
                <div style="height:1px;background-color:${colors.slate200};margin:8px 0"></div>
                <div style="display:flex;justify-content:space-between;align-items:center;background-color:rgba(13,148,136,0.05);padding:16px;border-radius:16px">
                    <span style="font-weight:900;color:${colors.slate800};text-transform:uppercase">Total</span>
                    <span style="font-size:24px;font-weight:900;color:${colors.primary}">₹${total.toLocaleString()}</span>
                </div>
            </div>
        </div>

        <div style="text-align:center;border-top:1px solid ${colors.slate100};padding-top:32px">
            <p style="margin:0;font-size:12px;color:${colors.slate400};font-weight:700">Thank you for choosing Clinixa Healthcare Services.</p>
            <p style="margin:8px 0 0 0;font-size:10px;color:${colors.slate300};font-style:italic">Computer generated bill - No signature required.</p>
        </div>
    `;

    return container;
}
