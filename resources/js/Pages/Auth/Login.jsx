import * as React from "react";
import {
    Avatar,
    Box,
    Button,
    Checkbox,
    CssBaseline,
    FormControlLabel,
    Grid,
    IconButton,
    TextField,
    Typography,
    Paper,
} from "@mui/material";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import { createTheme, ThemeProvider } from "@mui/material/styles";

import { Link, router } from "@inertiajs/react";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import VisibilityOffOutlinedIcon from "@mui/icons-material/VisibilityOffOutlined";
import { toast, ToastContainer } from "react-toastify";

const defaultTheme = createTheme();

export default function Login() {
    const [showPassword, setShowPassword] = React.useState(false);
    const handleClickShowPassword = () => setShowPassword((show) => !show);

    const handleSubmit = (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const email = formData.get("email");
        const password = formData.get("password");
        const remember_token = formData.get("remember_token");

        window.axios
            .post("/auth/login", {
                email: email,
                password: password,
                remember_token: remember_token,
            })
            .then((res) => {
                if (res.data.check === true) {
                    toast.success(res.data.message);
                    setTimeout(() => {
                        router.visit("/admin/", {
                            method: "get",
                        });
                    }, 2000);
                } else if (res.data.check === false) {
                    toast.warning(res.data.message);
                }
            })
            .catch((err) => {
                toast.error(err.response.data.message);
            });
    };

    return (
        <ThemeProvider theme={defaultTheme}>
            <ToastContainer autoClose={2000} />

            <Grid container component="main" sx={{ height: "100vh" }}>
                <CssBaseline />
                <Grid
                    item
                    xs={false}
                    sm={4}
                    md={7}
                    sx={{
                        backgroundImage:
                            "url(https://static.vecteezy.com/system/resources/thumbnails/023/886/344/small_2x/starry-night-landscape-with-mountain-and-milky-way-sky-background-beauty-in-nature-and-astrology-science-concept-digital-art-fantasy-illustration-generative-ai-photo.jpg)",
                        backgroundRepeat: "no-repeat",
                        backgroundColor: (t) =>
                            t.palette.mode === "light"
                                ? t.palette.grey[50]
                                : t.palette.grey[900],
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                    }}
                />
                <Grid
                    item
                    xs={12}
                    sm={8}
                    md={5}
                    component={Paper}
                    elevation={6}
                    square
                >
                    <Box
                        sx={{
                            my: 8,
                            mx: 4,
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                        }}
                    >
                        <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
                            <LockOutlinedIcon />
                        </Avatar>
                        <Typography component="h1" variant="h5">
                            Đăng nhập
                        </Typography>
                        <Box
                            component="form"
                            noValidate
                            sx={{ mt: 1, width: "100%" }}
                            onSubmit={handleSubmit}
                            method="post"
                        >
                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                id="email"
                                label="Địa chỉ Email"
                                name="email"
                                autoComplete="off"
                            />
                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                name="password"
                                label="Mật khẩu"
                                type={showPassword ? "text" : "password"}
                                id="password"
                                autoComplete="off"
                                InputProps={{
                                    // Thêm InputProps để tùy chỉnh input
                                    // Thêm icon vào cuối input
                                    endAdornment: (
                                        <IconButton
                                            aria-label="toggle password visibility"
                                            onClick={handleClickShowPassword}
                                            edge="end"
                                        >
                                            {showPassword ? (
                                                <VisibilityOffOutlinedIcon />
                                            ) : (
                                                <VisibilityOutlinedIcon />
                                            )}
                                        </IconButton>
                                    ),
                                }}
                            />
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        color="primary"
                                        name="remember_token"
                                    />
                                }
                                label="Hãy nhớ tài khoản của tôi!"
                            />
                            <Button
                                type="submit"
                                fullWidth
                                variant="contained"
                                sx={{ mt: 3, mb: 2 }}
                            >
                                Đăng nhập
                            </Button>
                            <Grid container>
                                <Grid item xs>
                                    <Link href="#">Quên mật khẩu?</Link>
                                </Grid>
                                <Grid item>
                                    <Link href="#">
                                        {"Bạn chưa có tài khoản? Đăng ký ngay!"}
                                    </Link>
                                </Grid>
                            </Grid>
                        </Box>
                    </Box>
                </Grid>
            </Grid>
        </ThemeProvider>
    );
}
