﻿import React, {useEffect, useState, useCallback,} from "react";
import {
    Button,
    FormControl,
    InputLabel,
    ListItem,
    MenuItem,
    Select, 
    TextField,
    Typography,
} from "@mui/material";
import api from "../Api";
import {useNavigate} from "react-router-dom";

type Product = {
    name: string;
    price: number;
    image: string;
    description: string;
    categoryId: string;
}

type Category = {
    categoryId: string,
    categoryName: string,
}

export default function AddProductPage(): JSX.Element {
    const [isAdmin, setIsAdmin] = useState<boolean>();
    const [headers, setHeaders] = useState<{ Authorization: string }>();
    const navigate = useNavigate();
    const [categories, setCategories] = useState<Category[]>()
    const [product, setProduct] = useState<Product>({
        name: "",
        price: 0,
        image: "",
        description: "",
        categoryId: ""
    });

    useEffect(() => {
        const token = localStorage.getItem("token");
        if(!token) {
            alert("Невозможно получить токен авторизации пользователя!");
            return;
        }
        setHeaders({ Authorization: `Bearer ${token}` });
    }, []);

    useEffect(() => {
        async function fetchData() {
            if(!headers) return;

            const userResponse = await api.get("/account/get_current", {
                headers,
            });

            const isAdmin = !!userResponse.data?.roles?.includes('Admin')
            setIsAdmin(isAdmin);
            if(!isAdmin) return;

            try {
                const categoriesResponse = await api.get("/categories/get_all", { headers });
                const categories = categoriesResponse.data.categories;
                setCategories(categories);
            } catch {
                alert("Невозможно получить категории, обновите страницу!")
            }
        }

        fetchData();
    }, [headers]);

    const createValueChangeHandler = useCallback((key: keyof Product, shouldParseFloat = false) => {
        return function (event: React.ChangeEvent<HTMLInputElement>) {
            let value: string | number = event.target.value;
            if(shouldParseFloat) {
                value = parseFloat(value);
                if(isNaN(value)) return;
            }

            setProduct(product => ({...product, [key]: value}));
        }
    }, []);

    const handleSubmit = useCallback(async () => {
        try {
            console.log(product);
            await api.post(`/products/add?Name=${product.name}&Price=${product.price}&Image=${product.image}&Description=${product.description}&CategoryId=${product.categoryId}`, null,{headers});
            alert("Добавлено");
            navigate('/Categories')
        } catch {
            alert("Ошибка при добавлении товара!");
        }
    }, [product, headers])

    if(isAdmin === undefined || categories === undefined) return <div>Loading...</div>;
    if(!isAdmin) return <div>Only admin is allowed to add products!</div>;
    return (
        <form>
            <Typography variant="h4" gutterBottom>
                Добавление продукта
            </Typography>
            <ListItem>
                <TextField sx={{width:'100%'}} required id="outlined-basic" label="Name" variant="outlined" value={product.name} onChange={createValueChangeHandler('name')}/>
            </ListItem>
            <ListItem>
                <TextField sx={{width:'100%'}} required id="outlined-basic" label="Price" variant="outlined" type="number" value={product.price} onChange={createValueChangeHandler('price')}/>
            </ListItem>
            <ListItem>
                <TextField sx={{width:'100%'}} id="outlined-basic" label="Image_Url" variant="outlined" value={product.image} onChange={createValueChangeHandler('image')}/>
            </ListItem>
            <ListItem>
                <TextField sx={{width:'100%'}} id="outlined-basic" label="Description" variant="outlined" value={product.description} onChange={createValueChangeHandler('description')}/>
            </ListItem>
            <ListItem>
                <FormControl fullWidth>
                    <InputLabel id="category-select-label">Category</InputLabel>
                    <Select
                        labelId="category-select-label"
                        id="category-select"
                        value={product.categoryId}
                        label="Select Category"
                        onChange={event => setProduct(product => ({...product, categoryId: event.target.value}))}
                    >
                        {categories.map(category => <MenuItem key={category.categoryId} value={category.categoryId}>{category.categoryName}</MenuItem>)}
                    </Select>
                </FormControl>
            </ListItem>
            <ListItem>
                <Button onClick={handleSubmit} variant="contained" size="large" sx={{ mt: 3,ml:12 }}>
                    Добавить
                </Button>
            </ListItem>

        </form>
    );
}