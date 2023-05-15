const { faker } = require('@faker-js/faker');
const empData = [1, 2, 3, 4, 5, 6].map(e => {
    return {
        count: e,
        transactionDate: faker.datatype.datetime().toISOString(),
        broughtFrom: faker.company.name(),
        value: faker.datatype.number({ min: 100, max: 300 }),
        productId: `${faker.datatype.number({ min: 4570, max: 4590 })}f#`
    }
})

const tempFakeData = []
const mqFakeData = []

const perishedPercentage = 70.2
for (let i = 0; i < 15; i++) {
    tempFakeData.push(faker.datatype.number({ min: 20, max: 35 }))
    mqFakeData.push(faker.datatype.number({ min: 1500, max: 2000 }))
}


const customerDetails = require('../Services/customerDetails')


function initHandler(app,config){
    app.get('/health',function(req,res,next){
          res.send("Health OK")
    });

    app.post('/productDetails', (req, res) => {
        const { broughtFrom, productType,productName,weight,price,deviceMacId } = req.body;
        config.connections.db.execute(`insert into products 
        (product_name,product_type,brought_from,weight_,price_,device_mac_id) 
        values ("${productName}","${productType}","${broughtFrom}",${weight},${price},"${deviceMacId}");`,(error,results,fields)=>{
            if(error){
               console.log(error)
            }
            else{
                console.log(results)
                return res.json({productId:results.insertId});
            }
        })
    });

    app.get('/productDetails/:id',(req,res)=>{
        const id = req.params.id
        config.connections.db.execute(
            `select * from products
             where product_id = ${id};`,
            (err,results,fields)=>{
                if(err){
                   console.log(err)
                }
                else{
                  return res.json({products:results})
                }
            }
        )
    })

    app.post('/retailersAuth', (req, res) => {
        const { email, password } = req.body;
        console.log(req.body);
        if (!email || !password) return res.json({ msg: "no password or email" })
        else if (email === "abcd" && password === "abcd")
            res.json({ token: "TOKEN" })
    })
    app.post('/retailersDashboard', (req, res) => {
        const { token } = req.body;
        console.log(req.body)
        if (token === "TOKEN")
            res.json({ in: empData, out: empData })
        else
            return res.json({ msg: "token missing" })
    })

    app.get('/customerDetails/:id', (req,res)=>{
         const id = req.params.id
         config.connections.db.execute(
            `select * from users 
            where user_id = ${id};`,(err,result,fields)=>{
                if(err){
                    console.log(err);
                }
                else{
                   console.log(result);
                   return res.json({details: result});
                }
            }
        );
    })

    app.post('/customerDetails', (req,res)=>{
        config.connections.db.execute(
            `insert into users ( user_name, designation) 
            values ("${req.body.user_name}","${req.body.designation}"); `,(err,result,fields)=>{
                if(err){
                    console.log(err);
                }
                else{
                   return res.json({userId:results.insertId});
                }
            }
        );
    })

    app.get('/qualityDetails/:id',(req,res)=>{
        config.connections.db.execute(
            `select * from quality where
             product_id = ${req.params.id};`,(err,results,fields)=>{
                if(err){
                  console.log(err)
                }
                else{
                    return res.json({quality_details:results})
                }
             }
        )
    })

    app.post('qualityDetails',(req,res)=>{
        config.connections.db.execute(
            `insert into quality ( product_id, temperature, humidity, gas) 
            values (${req.body.product_id},${req.body.temperature}, ${req.body.humidity}, ${req.body.gas}); `,(err,result,fields)=>{
                if(err){
                }
                else{
                   return res.json({status:"sucessfully inserted"});
                }
            }
        );
    })

    app.get('/quantityDetails/:id',(req,res)=>{
        config.connections.db.execute(
            `select * from aunatity where
             product_id = ${req.params.id};`,(err,results,fields)=>{
                if(err){
                  console.log(err)  
                }
                else{
                    return res.json({quantity_details:results})
                }
             }
        )
    })

    app.post('quantityDetails',(req,res)=>{
        config.connections.db.execute(
            `insert into quantity ( product_id, product_stop, weight_stop) 
            values (${req.body.product_id},${req.body.temperature}, ${req.body.humidity}, ${req.body.gas}); `,(err,result,fields)=>{
                if(err){
                    console.log(err)
                }
                else{
                   return res.json({status:"sucessfully inserted"});
                }
            }
        );
    })

}

module.exports = {initHandler}