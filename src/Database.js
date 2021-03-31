import SQLite from "react-native-sqlite-storage";
SQLite.DEBUG(true);
SQLite.enablePromise(true);

const database_name = "Reactoffline.db";
const database_version = "3.0";
const database_displayname = "SQLite React Offline Database";
const database_size = 200000;

import moment from 'moment' // 2.20.1
const _format = 'YYYY-MM-DD';


export default class Database {

    initDB() {

        return new Promise((resolve) => {
            console.log("Plugin integrity check ...");

            SQLite.echoTest()
                .then(() => {
                    console.log("Integrity check passed ...");
                    console.log("Opening database ...");
                    // this.closeDatabase(db);
                    SQLite.openDatabase(
                        database_name,
                        database_version,
                        database_displayname,
                        database_size
                    ).then(DB => {
                        let db;
                        db = DB;

                        console.log("Database OPEN");
                        db.executeSql('SELECT 1 FROM cart LIMIT 1').then(() => {
                            console.log("Database is ready ... executing query ...");
                        }).catch((error) => {

                            console.log("Received error: ", error);
                            console.log("Database not yet ready ... populating data");
                            db.transaction((tx) => {
                                tx.executeSql('CREATE TABLE IF NOT EXISTS [cart] ([cId] INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, [pId] NVARCHAR(50) NULL,[pName] NVARCHAR(255) NULL,[pDescription] NVARCHAR(255) NULL,[pPrice] NVARCHAR(255) NULL,[pOnePrice] NVARCHAR(255) NULL,[pQty] INTEGER NOT NULL,[pImage] NVARCHAR(1000) NULL, [pStatus] INTEGER NOT NULL)');
                                // tx.executeSql('CREATE TABLE IF NOT EXISTS [Period] ([pId] INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, [pName] NVARCHAR(50) NULL,[pDescription] NVARCHAR(255) NULL, [pCatId] INTEGER NOT NULL, [pParityBit] INTEGER NOT NULL, [pTime] NVARCHAR(50) NULL)');
                            }).then(() => {
                                console.log("Table created successfully");
                            }).catch(error => {
                                console.log(error);
                            });
                        });
                        resolve(db);
                    })
                        .catch(error => {
                            console.log(error);
                        });
                })
                .catch(error => {
                    console.log("echoTest failed - plugin not functional");
                });
        });

    };

    closeDatabase(db) {
        if (db) {
            console.log("Closing DB");
            db.close()
                .then(status => {
                    console.log("Database CLOSED");
                })
                .catch(error => {
                    //  console.log(error);
                    // this.errorCB(error);
                });
        } else {
            console.log("Database was not OPENED");
        }
    };
    loadDB() {
        this.initDB();
    }
    addtocart(db, data) {

        return new Promise((resolve) => {
            db.transaction((tx) => {
                tx.executeSql('INSERT OR IGNORE  INTO cart (pId,pName,pDescription,pPrice,pOnePrice,pQty,pImage,pStatus) VALUES ( ?,?,?,?,?,?,?,?)', [data.p_id, data.p_name, data.p_description, data.p_price, data.p_price, data.pQty, data.p_image, 1]).then(([tx, results]) => {
                    resolve(results);
                });


            }).then((result) => {
            }).catch((err) => {
                console.log(err);
            });
        });
    }
    listCartData(db) {
        return new Promise((resolve) => {
            const cart_data = [];
            db.transaction((tx) => {
                tx.executeSql('SELECT * FROM cart c ORDER BY c.cId DESC', []).then(([tx, results]) => {

                    var len = results.rows.length;
                    for (let i = 0; i < len; i++) {
                        let row = results.rows.item(i);
                        const { cId, pId, pName, pDescription, pPrice, pOnePrice, pStatus, pImage, pQty } = row;
                        cart_data.push({
                            cId,
                            pId,
                            pName,
                            pDescription,
                            pPrice,
                            pOnePrice,
                            pStatus,
                            pImage,
                            pQty

                        });
                    }
                    resolve(cart_data);
                });
            }).then((result) => {
            }).catch((err) => {
                console.log(err);
            });
        });
    }
    deleteItem(db, id) {
        return new Promise((resolve) => {
            db.transaction((tx) => {
                tx.executeSql('DELETE FROM cart WHERE pId = ?', [id]).then(([tx, results]) => {

                    resolve(results);
                });
            }).then((result) => {
            }).catch((err) => {
                console.log(err);
            });;
        });
    }

    deleteCartData(db) {
        console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> : ");
        return new Promise((resolve) => {
            db.transaction((tx) => {
                tx.executeSql('DELETE FROM cart', []).then(([tx, results]) => {

                    resolve(results);
                });
            }).then((result) => {
            }).catch((err) => {
                console.log(err);
            });;
        });
    }

    countMotherBag(db) {
        return new Promise((resolve) => {
            let motherbag_count;
            db.transaction((tx) => {
                tx.executeSql('SELECT COUNT(hId) AS motherbagcount FROM Hospitalbagmother WHERE hStatus="true"', []).then(([tx, results]) => {
                    var len = results.rows.length;
                    for (let i = 0; i < len; i++) {
                        let row = results.rows.item(i);
                        const { motherbagcount } = row;
                        motherbag_count = motherbagcount;
                    }
                    resolve(motherbag_count);
                });
            }).then((result) => {
            }).catch((err) => {
            });
        });
    }

    cartCont(db) {
        return new Promise((resolve) => {
            let cart_count;
            db.transaction((tx) => {

                tx.executeSql('SELECT COUNT(cId) AS cartcount FROM cart', []).then(([tx, results]) => {
                    var len = results.rows.length;
                    for (let i = 0; i < len; i++) {
                        let row = results.rows.item(i);
                        const { cartcount } = row;
                        cart_count = cartcount;
                     
                    }
                    resolve(cart_count);
                });
            }).then((result) => {

            }).catch((err) => {
                console.log(err);
            });
        });
    }


    listCartItems(db) {
        return new Promise((resolve) => {
            const cart_item = [];
            db.transaction((tx) => {
                tx.executeSql('SELECT * FROM cart c ORDER BY c.cId DESC ', []).then(([tx, results]) => {
                    var len = results.rows.length;
                    for (let i = 0; i < len; i++) {
                        let row = results.rows.item(i);
                        const { cId, pId, pName, pDescription, pPrice, pOnePrice, pStatus, pImage, pQty } = row;
                        cart_item.push({
                            cId,
                            pId,
                            pName,
                            pDescription,
                            pPrice,
                            pOnePrice,
                            pStatus,
                            pImage,
                            pQty
                        });
                    }

                    resolve(cart_item);
                });
            }).then((result) => {

            }).catch((err) => {
                console.log(err);
            });
        });
    }



    updateCart(db, newPrice, id) {

        return new Promise((resolve) => {
            db.transaction((tx) => {
                tx.executeSql('UPDATE cart SET pQty =pQty + ?,pPrice=?   WHERE pId = ?', [1, newPrice, id]).then(([tx, results]) => {
                    resolve(results);
                });
            }).then((result) => {
            }).catch((err) => {
                console.log(err);
            });
        });
    }

    addItemQty(db, data) {

        return new Promise((resolve) => {
            db.transaction((tx) => {
                tx.executeSql('UPDATE cart SET pQty =pQty + ?,pPrice=?   WHERE pId = ?', [data.pQty, data._pPrice, data.pId]).then(([tx, results]) => {
                    resolve(results);
                });
            }).then((result) => {
            }).catch((err) => {
                console.log(err);
            });
        });
    } subItemQty(db, data) {
        return new Promise((resolve) => {
            db.transaction((tx) => {
                tx.executeSql('UPDATE cart SET pQty =pQty - ?,pPrice=?   WHERE pId = ?', [data.pQty, data._pPrice, data.pId]).then(([tx, results]) => {
                    resolve(results);
                });
            }).then((result) => {
            }).catch((err) => {
                console.log(err);
            });
        });
    }
    getItemById(db, id) {

        return new Promise((resolve) => {
            const cart_item = [];
            db.transaction((tx) => {
                tx.executeSql('SELECT cId,pId,pPrice,pQty FROM cart WHERE pId = ? ', [id]).then(([tx, results]) => {
                    var len = results.rows.length;
                    for (let i = 0; i < len; i++) {
                        let row = results.rows.item(i);
                        const { cId, pId, pPrice, pQty } = row;
                        cart_item.push({
                            cId,
                            pId,

                            pPrice,

                            pQty
                        });
                    }

                    resolve(cart_item);
                });
            }).then((result) => {

            }).catch((err) => {
                console.log(err);
            });
        });
    }



}