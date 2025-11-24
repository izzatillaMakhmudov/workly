--
-- PostgreSQL database dump
--

-- Dumped from database version 14.18 (Homebrew)
-- Dumped by pg_dump version 14.18 (Homebrew)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

DROP DATABASE IF EXISTS nurly;
--
-- Name: nurly; Type: DATABASE; Schema: -; Owner: izzatillamakhmudov
--

CREATE DATABASE nurly WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE = 'C';


ALTER DATABASE nurly OWNER TO izzatillamakhmudov;

\connect nurly

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: lang_enum; Type: TYPE; Schema: public; Owner: izzatillamakhmudov
--

CREATE TYPE public.lang_enum AS ENUM (
    'ru',
    'en',
    'uz'
);


ALTER TYPE public.lang_enum OWNER TO izzatillamakhmudov;

--
-- Name: role_enum; Type: TYPE; Schema: public; Owner: izzatillamakhmudov
--

CREATE TYPE public.role_enum AS ENUM (
    'admin',
    'user',
    'operator'
);


ALTER TYPE public.role_enum OWNER TO izzatillamakhmudov;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: apiusers; Type: TABLE; Schema: public; Owner: izzatillamakhmudov
--

CREATE TABLE public.apiusers (
    id integer NOT NULL,
    username character varying(50) NOT NULL,
    password_hash character varying(255) NOT NULL,
    role character varying(20) DEFAULT 'user'::character varying NOT NULL
);


ALTER TABLE public.apiusers OWNER TO izzatillamakhmudov;

--
-- Name: apiusers_id_seq; Type: SEQUENCE; Schema: public; Owner: izzatillamakhmudov
--

CREATE SEQUENCE public.apiusers_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.apiusers_id_seq OWNER TO izzatillamakhmudov;

--
-- Name: apiusers_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: izzatillamakhmudov
--

ALTER SEQUENCE public.apiusers_id_seq OWNED BY public.apiusers.id;


--
-- Name: botusers; Type: TABLE; Schema: public; Owner: izzatillamakhmudov
--

CREATE TABLE public.botusers (
    id integer NOT NULL,
    phone_number character varying(13),
    role public.role_enum DEFAULT 'user'::public.role_enum,
    lang public.lang_enum DEFAULT 'uz'::public.lang_enum,
    chat_id character varying(50) NOT NULL
);


ALTER TABLE public.botusers OWNER TO izzatillamakhmudov;

--
-- Name: botusers_id_seq; Type: SEQUENCE; Schema: public; Owner: izzatillamakhmudov
--

CREATE SEQUENCE public.botusers_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.botusers_id_seq OWNER TO izzatillamakhmudov;

--
-- Name: botusers_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: izzatillamakhmudov
--

ALTER SEQUENCE public.botusers_id_seq OWNED BY public.botusers.id;


--
-- Name: licenses; Type: TABLE; Schema: public; Owner: izzatillamakhmudov
--

CREATE TABLE public.licenses (
    id integer NOT NULL,
    license_key character varying(255) NOT NULL,
    license_type character varying(20) NOT NULL,
    expires_at timestamp without time zone,
    activated boolean DEFAULT false,
    device_id character varying(100),
    notes character varying(50),
    key_index character varying(8),
    activated_at timestamp without time zone,
    customer_name character varying(255),
    customer_contact character varying(50)
);


ALTER TABLE public.licenses OWNER TO izzatillamakhmudov;

--
-- Name: licenses_id_seq; Type: SEQUENCE; Schema: public; Owner: izzatillamakhmudov
--

CREATE SEQUENCE public.licenses_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.licenses_id_seq OWNER TO izzatillamakhmudov;

--
-- Name: licenses_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: izzatillamakhmudov
--

ALTER SEQUENCE public.licenses_id_seq OWNED BY public.licenses.id;


--
-- Name: apiusers id; Type: DEFAULT; Schema: public; Owner: izzatillamakhmudov
--

ALTER TABLE ONLY public.apiusers ALTER COLUMN id SET DEFAULT nextval('public.apiusers_id_seq'::regclass);


--
-- Name: botusers id; Type: DEFAULT; Schema: public; Owner: izzatillamakhmudov
--

ALTER TABLE ONLY public.botusers ALTER COLUMN id SET DEFAULT nextval('public.botusers_id_seq'::regclass);


--
-- Name: licenses id; Type: DEFAULT; Schema: public; Owner: izzatillamakhmudov
--

ALTER TABLE ONLY public.licenses ALTER COLUMN id SET DEFAULT nextval('public.licenses_id_seq'::regclass);


--
-- Data for Name: apiusers; Type: TABLE DATA; Schema: public; Owner: izzatillamakhmudov
--

COPY public.apiusers (id, username, password_hash, role) FROM stdin;
5	botAdmin	$2b$12$0pduMfxSnrvzw./KnHoTQOl3hbefxAgsBAHvsHy/TARaqd7vf2v0a	admin
\.


--
-- Data for Name: botusers; Type: TABLE DATA; Schema: public; Owner: izzatillamakhmudov
--

COPY public.botusers (id, phone_number, role, lang, chat_id) FROM stdin;
36	998883422227	user	en	7131053550
37	998984442227	admin	ru	793338138
\.


--
-- Data for Name: licenses; Type: TABLE DATA; Schema: public; Owner: izzatillamakhmudov
--

COPY public.licenses (id, license_key, license_type, expires_at, activated, device_id, notes, key_index, activated_at, customer_name, customer_contact) FROM stdin;
11	$2b$12$.Wu01UmdsuwVARRtN6oiLuoY1kVHp.d2nCihlvr5VdnjoKrxw1s9.	lifetime	\N	f	\N	Full	UCF8UTDB	\N	An Nur magazin darhan	+998883422227
12	$2b$12$a5CX8/Wxeipahooojt1ePu4bpG7I04b7sxPMNyqwv43EZ1mWmdb5e	lifetime	\N	f	\N	Full	SBYJKWDZ	\N	An Nur magazin darhan	+998883422227
13	$2b$12$xwexudKneL9zfciSkpSp/OhGwMNhDyYqXWrxxEC62Q37ggp4KAOuy	2-year	2027-11-12 17:22:18.299	f	\N	Jsjdjd	HF8O6LDU	\N	Hdjdjd	Jejdjd
14	$2b$12$x2pA74tGkogjNGpRs10J7.iN/uGM03D6qh./yXZ2xOoFIwrwaXZk6	2-year	2027-11-12 17:25:03.871	f	\N	Trial	F3P9SM3H	\N	Izzatilla Makhmudov	+998883422227
15	$2b$12$1hMR6KMuE8bt0vfhH8Av6uUW/bTDCE9IQsLL1K/jnIvlcv9Ms9L6y	2-year	2027-11-12 17:27:20.335	f	\N	Jj	HQIDORFO	\N	Toxa	9909988
16	$2b$12$CIeh2C/YFBJ6KC4F9lCpVemWdw4f00YBopzUT1smwzH947MIeZsva	lifetime	\N	f	\N	Jjh	VUBWB4VX	\N	Nurr	9888836363
17	$2b$12$oURLqL/9zOhPdk8NBaTMt.RYa2e2B4GQCkKG.upUwqEUc.zMRIa2W	2-year	2027-11-12 17:32:26.158	f	\N	Hhhh	ETHSGXUL	\N	Hhhh	Bbhh
18	$2b$12$NrluFjYg.XVij5hpXdPSi.2AtywDkc9ue1KU9Shi5aqqI1PeQ2dCa	lifetime	\N	f	\N	Hjhh	PYSEHCVB	\N	Nmjk	Nnnj
19	$2b$12$9988yZeho.BUblQc1j9cIOtOQhSimp6IVOQ2RddOr6MrRJS.QFAt6	2-year	2027-11-12 17:33:44.065	f	\N	Bbjj	JJ5NFKR8	\N	Ugugub	Jjkk
20	$2b$12$QlUChAjslV5RqH7fiTwyEu1gCCKdDfnoxW3g/caTjS1GlyunWcoDi	2-year	2027-11-12 17:35:14.896	f	\N	Ndjdjdjd	MJ14MEOC	\N	Jdjdjdjd	Jdjdjdd
21	$2b$12$GI/P93HlXKpyRnj9UsA3je2VRh/CTWJs8drE4N6dBGFSTKhyAVRUy	lifetime	\N	f	\N	Yoq	7UQZ2JF5	\N	Kkimdir	Imaxmudov6789@gmail.com
22	$2b$12$nk4QOQUTwO7pPKAHJ1GZ5eV.Y793dQj54Uiq9ShenlrukPRcotneu	2-year	2027-11-12 17:42:42.415	f	\N	Nfjfnfn	4DUKBVDP	\N	Hhdhd	Bdbxjf
23	$2b$12$K8XYpdDm6PN2h2toMVF7j.NWGmdrVPNCaeSBtQQhrHYYpxETCfUC2	1-year	2026-11-12 17:48:52.323	f	\N	Bdbdnf	T0CTBEWI	\N	Yuyr	Ndjdnf
24	$2b$12$WYCbrz3ug7Uk/sLAYlJq7OZAHpw5zxoGQPj7PnZNTw/l6PEztS4z2	lifetime	\N	f	\N	Uyt	XLV8C9HR	\N	Tyt	Hjh
25	$2b$12$q9A6UhUKrLWtSIdKVhA0UOcJDxWeHaY7GXn.RPaMBa/jqs9WkgfmC	lifetime	\N	f	\N	Bjjj	DOQD6KB1	\N	Uyu	Hjhg
26	$2b$12$Eb8oI2wZhzLwECYldHDwQ.pHqrCcmLn8a.do7BkeibhXQ26YbM9J6	2-year	2027-11-12 17:52:58.961	f	\N	Njj	G0DXYSLK	\N	Ghhu	Huii
27	$2b$12$9CtXc49yxrKKFEFX3viDBO3u1BAgt0p8xjZywX3Hg8ElfeEYDoNKO	2-year	2027-11-12 17:55:24.271	f	\N	Empty	LUZTVVI2	\N	Darhan Market	980098778
28	$2b$12$ft08noTRFTFTckTXpFrydOjwhDVV6HcJ50O5x9Y/EZu8cEOLrF64m	2-year	2027-11-12 17:56:33.582	f	\N	Empty	ITSOYX2R	\N	Darhan market	987776767
29	$2b$12$ZjqeQw0AJx5Dz4VmNn1iceblIUY4Ps3D8.i1Dh4O8NlxYIfyWGj5u	2-year	2027-11-12 17:59:11.837	f	\N	T	B2X5LLJ0	\N	Test	Hhh
\.


--
-- Name: apiusers_id_seq; Type: SEQUENCE SET; Schema: public; Owner: izzatillamakhmudov
--

SELECT pg_catalog.setval('public.apiusers_id_seq', 5, true);


--
-- Name: botusers_id_seq; Type: SEQUENCE SET; Schema: public; Owner: izzatillamakhmudov
--

SELECT pg_catalog.setval('public.botusers_id_seq', 62, true);


--
-- Name: licenses_id_seq; Type: SEQUENCE SET; Schema: public; Owner: izzatillamakhmudov
--

SELECT pg_catalog.setval('public.licenses_id_seq', 29, true);


--
-- Name: apiusers apiusers_pkey; Type: CONSTRAINT; Schema: public; Owner: izzatillamakhmudov
--

ALTER TABLE ONLY public.apiusers
    ADD CONSTRAINT apiusers_pkey PRIMARY KEY (id);


--
-- Name: apiusers apiusers_username_key; Type: CONSTRAINT; Schema: public; Owner: izzatillamakhmudov
--

ALTER TABLE ONLY public.apiusers
    ADD CONSTRAINT apiusers_username_key UNIQUE (username);


--
-- Name: botusers botusers_chat_id_key; Type: CONSTRAINT; Schema: public; Owner: izzatillamakhmudov
--

ALTER TABLE ONLY public.botusers
    ADD CONSTRAINT botusers_chat_id_key UNIQUE (chat_id);


--
-- Name: botusers botusers_pkey; Type: CONSTRAINT; Schema: public; Owner: izzatillamakhmudov
--

ALTER TABLE ONLY public.botusers
    ADD CONSTRAINT botusers_pkey PRIMARY KEY (id);


--
-- Name: licenses licenses_license_key_key; Type: CONSTRAINT; Schema: public; Owner: izzatillamakhmudov
--

ALTER TABLE ONLY public.licenses
    ADD CONSTRAINT licenses_license_key_key UNIQUE (license_key);


--
-- Name: licenses licenses_pkey; Type: CONSTRAINT; Schema: public; Owner: izzatillamakhmudov
--

ALTER TABLE ONLY public.licenses
    ADD CONSTRAINT licenses_pkey PRIMARY KEY (id);


--
-- PostgreSQL database dump complete
--

