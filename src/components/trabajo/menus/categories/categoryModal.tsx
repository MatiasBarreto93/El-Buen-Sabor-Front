import {Button, Col, Form, Modal, Row} from "react-bootstrap";
import React, {useEffect, useState} from "react";
import {toast} from "react-toastify";
import {useAuth0} from "@auth0/auth0-react";
import {Category} from "../../../../types/category";

interface Props {
    show: boolean;
    onHide: () => void;
    title:string
    cat: Category;
    fetchCategories: () => void;
}

export const CategoryModal = ( { show, onHide, title, cat, fetchCategories }: Props) => {
    const { getAccessTokenSilently } = useAuth0();

    const [category, setCategory] = useState<Category | undefined>(cat? cat : {
        id: 0,
        denomination: "",
        isBanned: false,
        fatherCategory: null,
        childCategories: null,
    });

    const [categories, setCategories] = useState<Category[]>([]);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const token = await getAccessTokenSilently();
                const response = await fetch("http://localhost:8080/api/v1/categories", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                if (response.ok) {
                    const data = await response.json();
                    setCategories(data)
                    console.log(data)
                } else {
                    console.error("Error fetching data:", response.status);
                }
            } catch (e) {
                console.error("Error fetching data:", e);
            }
        };
        fetchCategories();
    }, []);

}