const billingService = require("./billing.services");

exports.createInvoice = async (req, res) => {
  try {
    const { appointment_id, patient_id } = req.body;

    if (!appointment_id || !patient_id) {
      return res.status(400).json({
        success: false,
        message: "appointment_id and patient_id are required"
      });
    }

    const result = await billingService.createInvoice({
      appointment_id,
      patient_id
    });

    return res.status(201).json({
      success: true,
      message: "Invoice created successfully",
      invoiceId: result.insertId
    });

  } catch (error) {
    console.error("Create Invoice Error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error"
    });
  }
};


exports.getInvoiceById = async (req, res) => {
  try {
    const id = parseInt(req.params.id);

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Valid invoice ID is required"
      });
    }

    const result = await billingService.getInvoiceById(id);

    if (!result || result.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Invoice not found"
      });
    }

    return res.status(200).json({
      success: true,
      data: result[0]
    });

  } catch (error) {
    console.error("Get Invoice Error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error"
    });
  }
};


exports.searchInvoice = async (req, res) => {
  try {
    const { term } = req.query;

    if (!term) {
      return res.status(400).json({
        success: false,
        message: "Search term is required"
      });
    }

    const result = await billingService.searchInvoice(term);

    return res.status(200).json({
      success: true,
      count: result.length,
      data: result
    });

  } catch (error) {
    console.error("Search Invoice Error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error"
    });
  }
};
