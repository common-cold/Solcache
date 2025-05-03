import express from "express";
import cors from "cors";
import { authMiddleware } from "./middleware";

const app = express();

app.use(express.json());
app.use(cors());


app.post('/api/v1/user', async (req, res) => {
    const body = req.body;
    const userDb = await prismaClient.user.upsert({
        where: {
            email: body.email,
        },
        update:{},
        create: {
            email: body.email,
            role: body.role
        }
    });

    res.json({
        userId: userDb.id
    });
});

app.get('/api/v1/user', async(req, ress)=> {
    ress.json({
        message: "up"
    });
})
// app.post("/dapp", async (req, res) => {
//     const userId = req.userId;
//     const { dappName } = req.body;

//     if(!userId) {
//         res.status(401).json("No userId given");
//         return;
//     }
    
//     const dapp = await prismaClient.dapp.create({
//         data: {
//             userId: userId,
//             dappName: dappName as string,
//         }
//     });

//     res.json({
//         dapp
//     });
// });

// app.post("/asset", async (req, res) => {
//     const userId = req.userId;
//     const { cdnUrl, dataHash, dappId } = req.body;

//     if(!userId) {
//         res.status(401).json("No userId given");
//         return;
//     } else if(!dappId || !cdnUrl || !dataHash) {
//         res.status(400).json("Some arguments are missing");
//         return;
//     }
    
//     const asset = await prismaClient.asset.create({
//         data: {
//             cdnUrl: cdnUrl,
//             dataHash: dataHash,
//             dappId: dappId,
//         }
//     });

//     res.json({
//         asset
//     });
// });

// app.post("/cachenode", async (req, res) => {
//     const userId = req.userId;
//     const { location } = req.body;

    
// });



app.listen(8080);