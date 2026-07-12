const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// 1. CREATE A NEW ASSET
exports.createAsset = async (req, res) => {
    try {
        const { asset_tag, name, category_id, serial_number, purchase_date, purchase_cost, condition, location, is_bookable, photo_url } = req.body;

        // Quick verification check
        if (!asset_tag || !name || !category_id || !purchase_date) {
            return res.status(400).json({ success: false, message: "Missing required tracking fields." });
        }

        const newAsset = await prisma.asset.create({
            data: {
                asset_tag,
                name,
                category_id,
                serial_number,
                purchase_date: new Date(purchase_date),
                purchase_cost: parseFloat(purchase_cost) || 0.0,
                condition: condition || "GOOD",
                location,
                is_bookable: is_bookable || false,
                photo_url,
                created_by: req.user?.id || "SYSTEM" // Attached securely by Member 1's auth middleware
            }
        });

        res.status(201).json({ success: true, data: newAsset });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error adding asset to registry.", error: error.message });
    }
};

// 2. GET ALL ASSETS (With Filter Capabilities for Frontend Search)
exports.getAllAssets = async (req, res) => {
    try {
        const { status, category_id, search } = req.query;

        // Build dynamic query clauses matching the Team Contract
        let whereClause = {};
        if (status) whereClause.status = status;
        if (category_id) whereClause.category_id = category_id;
        if (search) {
            whereClause.OR = [
                { name: { contains: search, mode: 'insensitive' } },
                { asset_tag: { contains: search, mode: 'insensitive' } }
            ];
        }

        const assets = await prisma.asset.findMany({ where: whereClause });
        res.status(200).json({ success: true, count: assets.length, data: assets });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error fetching assets.", error: error.message });
    }
};

// 3. GET SINGLE ASSET BY ID
exports.getAssetById = async (req, res) => {
    try {
        const asset = await prisma.asset.findUnique({ where: { id: req.params.id } });
        if (!asset) return res.status(404).json({ success: false, message: "Asset not found." });
        res.status(200).json({ success: true, data: asset });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error fetching asset details.", error: error.message });
    }
};