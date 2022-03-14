--
-- PostgreSQL database dump
--

-- Dumped from database version 13.5 (Ubuntu 13.5-2.pgdg20.04+1)
-- Dumped by pg_dump version 14.0

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
-- Data for Name: auth_user; Type: TABLE DATA; Schema: public; Owner: hpxeuyirmmyfuv
--

INSERT INTO public.auth_user VALUES (1, 'pbkdf2_sha256$260000$KPFq1zgk9AAeMdz7fZtSzM$c3JM1ZQzTsa9aFwDiMrXgrNS6lxTSXJUxEquRUt01w8=', '2022-01-19 14:50:32.263658+00', true, 'admin', '', '', 'haro.lato@gmail.com', true, true, '2021-10-21 22:17:01+00');


--
-- Data for Name: project; Type: TABLE DATA; Schema: public; Owner: hpxeuyirmmyfuv
--

INSERT INTO public.project VALUES (3, '2021-11-08 20:28:33.570591+00', '2021-12-07 00:24:49.374749+00', 'SmallAmpCI-Pharo', 'Pharo testing', 'mabdi', 'smalltalk-SmallBank');


--
-- Data for Name: job; Type: TABLE DATA; Schema: public; Owner: hpxeuyirmmyfuv
--

INSERT INTO public.job VALUES (3, '2a9d07aaba97102afb6f6c0831c886d5d26ff968', '?', '["src/SmallAmpCI-Tests/FakeCrashingTest.class.st:testCrashMe", "src/SmallAmpCI-Tests/FakeCrashingTest.class.st:testSomeAction", "src/SmallAmpCI-Tests/FakeFreezingTest.class.st:testFreezeMe", "src/SmallAmpCI-Tests/FakeFreezingTest.class.st:testFreezeMe2", "src/SmallAmpCI-Tests/FakeFreezingTest.class.st:testSomeAction", "src/SmallBank-Tests/SmallBank2Test.class.st:testDeposit", "src/SmallBank-Tests/SmallBank2Test.class.st:testInit", "src/SmallBank-Tests/SmallBank2Test.class.st:testPercent", "src/SmallBank-Tests/SmallBank2Test.class.st:testWithdraw", "src/SmallBank-Tests/SmallBankTest.class.st:testDeposit", "src/SmallBank-Tests/SmallBankTest.class.st:testInit", "src/SmallBank-Tests/SmallBankTest.class.st:testWithdraw"]', '2021-10-29 11:02:11.278658+00', '?', '2021-11-08 20:28:47.341262+00', 3, NULL);
INSERT INTO public.job VALUES (7, '677fe6ef88a8e289cbdbbd0e41ffeadc44f07402', '1', '["src/SmallAmpCI-Tests/FakeCrashingTest.class.st:testCrashMe", "src/SmallAmpCI-Tests/FakeCrashingTest.class.st:testSomeAction", "src/SmallAmpCI-Tests/FakeFreezingTest.class.st:testFreezeMe", "src/SmallAmpCI-Tests/FakeFreezingTest.class.st:testFreezeMe2", "src/SmallAmpCI-Tests/FakeFreezingTest.class.st:testSomeAction", "src/SmallBank-Tests/SmallBank2Test.class.st:testDeposit", "src/SmallBank-Tests/SmallBank2Test.class.st:testInit", "src/SmallBank-Tests/SmallBank2Test.class.st:testPercent", "src/SmallBank-Tests/SmallBank2Test.class.st:testWithdraw", "src/SmallBank-Tests/SmallBankTest.class.st:testDeposit", "src/SmallBank-Tests/SmallBankTest.class.st:testInit", "src/SmallBank-Tests/SmallBankTest.class.st:testWithdraw"]', '2021-12-02 09:16:39.779745+00', 'mutalkCI', '2021-12-02 09:16:39.779767+00', 3, NULL);
INSERT INTO public.job VALUES (8, '677fe6ef88a8e289cbdbbd0e41ffeadc44f07402', '1', '["src/SmallAmpCI-Tests/FakeCrashingTest.class.st:testCrashMe", "src/SmallAmpCI-Tests/FakeCrashingTest.class.st:testSomeAction", "src/SmallAmpCI-Tests/FakeFreezingTest.class.st:testFreezeMe", "src/SmallAmpCI-Tests/FakeFreezingTest.class.st:testFreezeMe2", "src/SmallAmpCI-Tests/FakeFreezingTest.class.st:testSomeAction", "src/SmallBank-Tests/SmallBank2Test.class.st:testDeposit", "src/SmallBank-Tests/SmallBank2Test.class.st:testInit", "src/SmallBank-Tests/SmallBank2Test.class.st:testPercent", "src/SmallBank-Tests/SmallBank2Test.class.st:testWithdraw", "src/SmallBank-Tests/SmallBankTest.class.st:testDeposit", "src/SmallBank-Tests/SmallBankTest.class.st:testInit", "src/SmallBank-Tests/SmallBankTest.class.st:testWithdraw"]', '2021-12-09 09:50:36.739388+00', 'mutalkCI', '2021-12-09 09:50:36.739412+00', 3, NULL);
INSERT INTO public.job VALUES (9, '677fe6ef88a8e289cbdbbd0e41ffeadc44f07402', '1', '["src/SmallAmpCI-Tests/FakeCrashingTest.class.st:testCrashMe", "src/SmallAmpCI-Tests/FakeCrashingTest.class.st:testSomeAction", "src/SmallAmpCI-Tests/FakeFreezingTest.class.st:testFreezeMe", "src/SmallAmpCI-Tests/FakeFreezingTest.class.st:testFreezeMe2", "src/SmallAmpCI-Tests/FakeFreezingTest.class.st:testSomeAction", "src/SmallBank-Tests/SmallBank2Test.class.st:testDeposit", "src/SmallBank-Tests/SmallBank2Test.class.st:testInit", "src/SmallBank-Tests/SmallBank2Test.class.st:testPercent", "src/SmallBank-Tests/SmallBank2Test.class.st:testWithdraw", "src/SmallBank-Tests/SmallBankTest.class.st:testDeposit", "src/SmallBank-Tests/SmallBankTest.class.st:testInit", "src/SmallBank-Tests/SmallBankTest.class.st:testWithdraw"]', '2021-12-09 10:09:40.698114+00', 'mutalkCI', '2021-12-10 14:05:02.818395+00', 3, 38);


--
-- Data for Name: file; Type: TABLE DATA; Schema: public; Owner: hpxeuyirmmyfuv
--

INSERT INTO public.file VALUES (3, 'e0c0e1469927dbfe96030e559a96833f', 'src/SmallAmpCI-Tests/FakeObjectUnderTest.class.st', 3, '2021-10-29 11:02:11.291004+00', '2021-10-29 11:02:11.291029+00');
INSERT INTO public.file VALUES (4, 'fe23085fd2aec37cfbce37cdbf01c517', 'src/BaselineOfSmallBank/BaselineOfSmallBank.class.st', 3, '2021-10-29 11:02:11.362045+00', '2021-10-29 11:02:11.362072+00');
INSERT INTO public.file VALUES (5, '28c38067098c7a4bfe27833c9b61df1a', 'src/SmallBank/SmallBank.class.st', 3, '2021-10-29 11:02:11.367266+00', '2021-10-29 11:02:11.367292+00');
INSERT INTO public.file VALUES (6, '9ce7cd097146062c434ada67e781ea6a', 'src/SmallBank/SmallBank2.class.st', 3, '2021-10-29 11:02:11.426242+00', '2021-10-29 11:02:11.426263+00');
INSERT INTO public.file VALUES (7, 'e0c0e1469927dbfe96030e559a96833f', 'src/SmallAmpCI-Tests/FakeObjectUnderTest.class.st', 7, '2021-12-02 09:16:39.78853+00', '2021-12-02 09:16:39.788563+00');
INSERT INTO public.file VALUES (8, 'fe23085fd2aec37cfbce37cdbf01c517', 'src/BaselineOfSmallBank/BaselineOfSmallBank.class.st', 7, '2021-12-02 09:16:39.865157+00', '2021-12-02 09:16:39.865178+00');
INSERT INTO public.file VALUES (9, '28c38067098c7a4bfe27833c9b61df1a', 'src/SmallBank/SmallBank.class.st', 7, '2021-12-02 09:16:39.8731+00', '2021-12-02 09:16:39.873119+00');
INSERT INTO public.file VALUES (10, '9ce7cd097146062c434ada67e781ea6a', 'src/SmallBank/SmallBank2.class.st', 7, '2021-12-02 09:16:39.958019+00', '2021-12-02 09:16:39.958041+00');
INSERT INTO public.file VALUES (11, 'e0c0e1469927dbfe96030e559a96833f', 'src/SmallAmpCI-Tests/FakeObjectUnderTest.class.st', 8, '2021-12-09 09:50:36.748678+00', '2021-12-09 09:50:36.748701+00');
INSERT INTO public.file VALUES (12, 'e0c0e1469927dbfe96030e559a96833f', 'src/SmallAmpCI-Tests/FakeObjectUnderTest.class.st', 9, '2021-12-09 10:09:40.701381+00', '2021-12-09 10:09:40.701409+00');
INSERT INTO public.file VALUES (13, 'fe23085fd2aec37cfbce37cdbf01c517', 'src/BaselineOfSmallBank/BaselineOfSmallBank.class.st', 9, '2021-12-09 10:09:40.846134+00', '2021-12-09 10:09:40.84616+00');
INSERT INTO public.file VALUES (14, '28c38067098c7a4bfe27833c9b61df1a', 'src/SmallBank/SmallBank.class.st', 9, '2021-12-09 10:09:40.850942+00', '2021-12-09 10:09:40.850965+00');
INSERT INTO public.file VALUES (15, '9ce7cd097146062c434ada67e781ea6a', 'src/SmallBank/SmallBank2.class.st', 9, '2021-12-09 10:09:40.928582+00', '2021-12-09 10:09:40.928606+00');


--
-- Data for Name: mutation; Type: TABLE DATA; Schema: public; Owner: hpxeuyirmmyfuv
--

INSERT INTO public.mutation VALUES (37, 3, 'Replace #/ with #* in FakeObjectUnderTest>>#doFreeze:', 24, 24, '	[ 1 * anInt ] on: Error do:  [ self doFreeze  ] ', 'S', 7, '2021-12-02 09:16:39.810241+00', '2021-12-02 09:16:39.81026+00', NULL, NULL);
INSERT INTO public.mutation VALUES (4, 1, 'Remove Exception Handler Operator in FakeObjectUnderTest>>#doFreeze:', 24, 24, '[ 1 / anInt ] value', 'S', 3, '2021-10-29 11:02:11.29797+00', '2021-10-29 11:02:11.297995+00', NULL, NULL);
INSERT INTO public.mutation VALUES (5, 2, 'Replace #/ with #* in FakeObjectUnderTest>>#doFreeze:', 24, 24, '1 * anInt', 'S', 3, '2021-10-29 11:02:11.304544+00', '2021-10-29 11:02:11.304566+00', NULL, NULL);
INSERT INTO public.mutation VALUES (6, 3, 'Remove ^ in FakeObjectUnderTest>>#echo:', 29, 29, 'obj', 'S', 3, '2021-10-29 11:02:11.315732+00', '2021-10-29 11:02:11.315762+00', NULL, NULL);
INSERT INTO public.mutation VALUES (7, 4, 'Remove Exception Handler Operator in FakeObjectUnderTest>>#doCrash:', 14, 14, '[ 1 / anInt ] value', 'S', 3, '2021-10-29 11:02:11.322299+00', '2021-10-29 11:02:11.322322+00', NULL, NULL);
INSERT INTO public.mutation VALUES (8, 5, 'Replace #/ with #* in FakeObjectUnderTest>>#doCrash:', 14, 14, '1 * anInt', 'S', 3, '2021-10-29 11:02:11.328645+00', '2021-10-29 11:02:11.328673+00', NULL, NULL);
INSERT INTO public.mutation VALUES (9, 6, 'Remove ^ in FakeObjectUnderTest>>#someAction:', 34, 34, '0', 'S', 3, '2021-10-29 11:02:11.333355+00', '2021-10-29 11:02:11.333383+00', NULL, NULL);
INSERT INTO public.mutation VALUES (10, 7, 'Remove ^ in FakeObjectUnderTest>>#someAction:', 34, 34, '1', 'S', 3, '2021-10-29 11:02:11.338577+00', '2021-10-29 11:02:11.338603+00', NULL, NULL);
INSERT INTO public.mutation VALUES (11, 8, 'Replace #= with #''~='' in FakeObjectUnderTest>>#someAction:', 34, 34, 'anInt ~= 0', 'S', 3, '2021-10-29 11:02:11.343844+00', '2021-10-29 11:02:11.34387+00', NULL, NULL);
INSERT INTO public.mutation VALUES (12, 9, 'Replace #ifTrue:ifFalse: receiver with false in FakeObjectUnderTest>>#someAction:', 34, 34, 'false	ifTrue: [ ^ 0 ]	ifFalse: [ ^ 1 ]', 'S', 3, '2021-10-29 11:02:11.349057+00', '2021-10-29 11:02:11.349082+00', NULL, NULL);
INSERT INTO public.mutation VALUES (13, 10, 'Replace #ifTrue:ifFalse: receiver with true in FakeObjectUnderTest>>#someAction:', 34, 34, 'true	ifTrue: [ ^ 0 ]	ifFalse: [ ^ 1 ]', 'S', 3, '2021-10-29 11:02:11.354654+00', '2021-10-29 11:02:11.35468+00', NULL, NULL);
INSERT INTO public.mutation VALUES (14, 1, 'Remove ^ in SmallBank>>#balance', 12, 12, 'balance', 'K', 5, '2021-10-29 11:02:11.370101+00', '2021-10-29 11:02:11.370132+00', NULL, NULL);
INSERT INTO public.mutation VALUES (15, 2, 'Replace #+ with #- in SmallBank>>#deposit:', 17, 17, 'balance - amount', 'K', 5, '2021-10-29 11:02:11.374686+00', '2021-10-29 11:02:11.374716+00', NULL, NULL);
INSERT INTO public.mutation VALUES (16, 3, 'Remove ^ in SmallBank>>#withdraw:', 37, 37, 'true', 'S', 5, '2021-10-29 11:02:11.379209+00', '2021-10-29 11:02:11.37924+00', NULL, NULL);
INSERT INTO public.mutation VALUES (17, 4, 'Remove ^ in SmallBank>>#withdraw:', 38, 38, 'false', 'S', 5, '2021-10-29 11:02:11.384175+00', '2021-10-29 11:02:11.384204+00', NULL, NULL);
INSERT INTO public.mutation VALUES (18, 5, 'Replace #''>='' with #= in SmallBank>>#withdraw:', 34, 34, 'balance = amount', 'K', 5, '2021-10-29 11:02:11.388727+00', '2021-10-29 11:02:11.388751+00', NULL, NULL);
INSERT INTO public.mutation VALUES (19, 6, 'Replace #''>='' with #> in SmallBank>>#withdraw:', 34, 34, 'balance > amount', 'S', 5, '2021-10-29 11:02:11.392961+00', '2021-10-29 11:02:11.39298+00', NULL, NULL);
INSERT INTO public.mutation VALUES (20, 7, 'Replace #- with #+ in SmallBank>>#withdraw:', 36, 36, 'balance + amount', 'K', 5, '2021-10-29 11:02:11.404573+00', '2021-10-29 11:02:11.4046+00', NULL, NULL);
INSERT INTO public.mutation VALUES (21, 8, 'Replace #ifTrue: receiver with false in SmallBank>>#withdraw:', 34, 37, 'false ifTrue: [ 	balance := balance - amount.	^ true ]', 'K', 5, '2021-10-29 11:02:11.409536+00', '2021-10-29 11:02:11.409557+00', NULL, NULL);
INSERT INTO public.mutation VALUES (22, 9, 'Replace #ifTrue: receiver with true in SmallBank>>#withdraw:', 34, 37, 'true ifTrue: [ 	balance := balance - amount.	^ true ]', 'S', 5, '2021-10-29 11:02:11.413575+00', '2021-10-29 11:02:11.413593+00', NULL, NULL);
INSERT INTO public.mutation VALUES (23, 10, 'Replace #ifTrue: with #ifFalse: in SmallBank>>#withdraw:', 34, 37, 'balance >= amount ifFalse: [ 	balance := balance - amount.	^ true ]', 'K', 5, '2021-10-29 11:02:11.41977+00', '2021-10-29 11:02:11.41979+00', NULL, NULL);
INSERT INTO public.mutation VALUES (24, 1, 'Replace #+ with #- in SmallBank2>>#deposit:', 46, 46, 'balance - amount', 'K', 6, '2021-10-29 11:02:11.428486+00', '2021-10-29 11:02:11.428509+00', NULL, NULL);
INSERT INTO public.mutation VALUES (25, 2, 'Replace #< with #> in SmallBank2>>#deposit:', 44, 44, 'amount > 0', 'K', 6, '2021-10-29 11:02:11.433099+00', '2021-10-29 11:02:11.433118+00', NULL, NULL);
INSERT INTO public.mutation VALUES (26, 3, 'Replace #ifTrue: receiver with false in SmallBank2>>#deposit:', 44, 45, 'false ifTrue: [ Error new signal ]', 'S', 6, '2021-10-29 11:02:11.437103+00', '2021-10-29 11:02:11.437128+00', NULL, NULL);
INSERT INTO public.mutation VALUES (27, 4, 'Replace #ifTrue: receiver with true in SmallBank2>>#deposit:', 44, 45, 'true ifTrue: [ Error new signal ]', 'K', 6, '2021-10-29 11:02:11.441004+00', '2021-10-29 11:02:11.441022+00', NULL, NULL);
INSERT INTO public.mutation VALUES (28, 5, 'Replace #ifTrue: with #ifFalse: in SmallBank2>>#deposit:', 44, 45, 'amount < 0 ifFalse: [ Error new signal ]', 'K', 6, '2021-10-29 11:02:11.444609+00', '2021-10-29 11:02:11.444632+00', NULL, NULL);
INSERT INTO public.mutation VALUES (29, 6, 'Replace #''>='' with #= in SmallBank2>>#withdraw:', 56, 56, 'balance = amount', 'K', 6, '2021-10-29 11:02:11.448229+00', '2021-10-29 11:02:11.448245+00', NULL, NULL);
INSERT INTO public.mutation VALUES (30, 7, 'Replace #''>='' with #> in SmallBank2>>#withdraw:', 56, 56, 'balance > amount', 'S', 6, '2021-10-29 11:02:11.451859+00', '2021-10-29 11:02:11.451875+00', NULL, NULL);
INSERT INTO public.mutation VALUES (31, 8, 'Replace #- with #+ in SmallBank2>>#withdraw:', 57, 57, 'balance + amount', 'K', 6, '2021-10-29 11:02:11.455447+00', '2021-10-29 11:02:11.455464+00', NULL, NULL);
INSERT INTO public.mutation VALUES (32, 9, 'Replace #ifTrue:ifFalse: receiver with false in SmallBank2>>#withdraw:', 56, 58, 'false	ifTrue: [ balance := balance - amount ]	ifFalse: [ Error new signal ]', 'K', 6, '2021-10-29 11:02:11.459182+00', '2021-10-29 11:02:11.459198+00', NULL, NULL);
INSERT INTO public.mutation VALUES (33, 10, 'Replace #ifTrue:ifFalse: receiver with true in SmallBank2>>#withdraw:', 56, 58, 'true	ifTrue: [ balance := balance - amount ]	ifFalse: [ Error new signal ]', 'S', 6, '2021-10-29 11:02:11.462842+00', '2021-10-29 11:02:11.462858+00', NULL, NULL);
INSERT INTO public.mutation VALUES (34, 11, 'Remove ^ in SmallBank2>>#balance', 39, 39, 'balance', 'K', 6, '2021-10-29 11:02:11.466922+00', '2021-10-29 11:02:11.466938+00', NULL, NULL);
INSERT INTO public.mutation VALUES (35, 1, 'Remove ^ in FakeObjectUnderTest>>#echo:', 29, 29, '	obj', 'S', 7, '2021-12-02 09:16:39.792489+00', '2021-12-02 09:16:39.792516+00', NULL, NULL);
INSERT INTO public.mutation VALUES (36, 2, 'Remove Exception Handler Operator in FakeObjectUnderTest>>#doFreeze:', 24, 24, '	[ 1 / anInt ] value ', 'S', 7, '2021-12-02 09:16:39.804006+00', '2021-12-02 09:16:39.804031+00', NULL, NULL);
INSERT INTO public.mutation VALUES (38, 4, 'Remove ^ in FakeObjectUnderTest>>#someAction:', 34, 34, '	anInt = 0 ifTrue: [ 0 ] ifFalse: [ ^ 1 ]', 'S', 7, '2021-12-02 09:16:39.814765+00', '2021-12-02 09:16:39.814791+00', NULL, NULL);
INSERT INTO public.mutation VALUES (39, 5, 'Remove ^ in FakeObjectUnderTest>>#someAction:', 34, 34, '	anInt = 0 ifTrue: [ ^ 0 ] ifFalse: [ 1 ]', 'S', 7, '2021-12-02 09:16:39.819983+00', '2021-12-02 09:16:39.820007+00', NULL, NULL);
INSERT INTO public.mutation VALUES (40, 6, 'Replace #= with #''~='' in FakeObjectUnderTest>>#someAction:', 34, 34, '	anInt ~= 0 ifTrue: [ ^ 0 ] ifFalse: [ ^ 1 ]', 'S', 7, '2021-12-02 09:16:39.824646+00', '2021-12-02 09:16:39.82467+00', NULL, NULL);
INSERT INTO public.mutation VALUES (41, 7, 'Replace #ifTrue:ifFalse: receiver with false in FakeObjectUnderTest>>#someAction:', 34, 34, '	false
	ifTrue: [ ^ 0 ]
	ifFalse: [ ^ 1 ]', 'S', 7, '2021-12-02 09:16:39.829186+00', '2021-12-02 09:16:39.82921+00', NULL, NULL);
INSERT INTO public.mutation VALUES (42, 8, 'Replace #ifTrue:ifFalse: receiver with true in FakeObjectUnderTest>>#someAction:', 34, 34, '	true
	ifTrue: [ ^ 0 ]
	ifFalse: [ ^ 1 ]', 'S', 7, '2021-12-02 09:16:39.834174+00', '2021-12-02 09:16:39.834243+00', NULL, NULL);
INSERT INTO public.mutation VALUES (43, 9, 'Remove Exception Handler Operator in FakeObjectUnderTest>>#doCrash:', 14, 14, '	[ 1 / anInt ] value', 'S', 7, '2021-12-02 09:16:39.845128+00', '2021-12-02 09:16:39.84515+00', NULL, NULL);
INSERT INTO public.mutation VALUES (44, 10, 'Replace #/ with #* in FakeObjectUnderTest>>#doCrash:', 14, 14, '	[ 1 * anInt ] on: Error do:  [ self doCrash  ]', 'S', 7, '2021-12-02 09:16:39.853129+00', '2021-12-02 09:16:39.85315+00', NULL, NULL);
INSERT INTO public.mutation VALUES (45, 1, 'Remove ^ in SmallBank>>#balance', 12, 12, '	balance', 'K', 9, '2021-12-02 09:16:39.875242+00', '2021-12-02 09:16:39.875264+00', NULL, NULL);
INSERT INTO public.mutation VALUES (46, 2, 'Replace #+ with #- in SmallBank>>#deposit:', 17, 17, '	balance := balance - amount', 'K', 9, '2021-12-02 09:16:39.880355+00', '2021-12-02 09:16:39.880376+00', NULL, NULL);
INSERT INTO public.mutation VALUES (47, 3, 'Remove ^ in SmallBank>>#withdraw:', 37, 37, '			true ].', 'S', 9, '2021-12-02 09:16:39.887223+00', '2021-12-02 09:16:39.887244+00', NULL, NULL);
INSERT INTO public.mutation VALUES (48, 4, 'Remove ^ in SmallBank>>#withdraw:', 38, 38, '	false', 'S', 9, '2021-12-02 09:16:39.893147+00', '2021-12-02 09:16:39.893168+00', NULL, NULL);
INSERT INTO public.mutation VALUES (49, 5, 'Replace #''>='' with #= in SmallBank>>#withdraw:', 34, 34, '	balance = amount', 'K', 9, '2021-12-02 09:16:39.898544+00', '2021-12-02 09:16:39.898565+00', NULL, NULL);
INSERT INTO public.mutation VALUES (50, 6, 'Replace #''>='' with #> in SmallBank>>#withdraw:', 34, 34, '	balance > amount', 'S', 9, '2021-12-02 09:16:39.907039+00', '2021-12-02 09:16:39.90706+00', NULL, NULL);
INSERT INTO public.mutation VALUES (51, 7, 'Replace #- with #+ in SmallBank>>#withdraw:', 36, 36, '			balance := balance + amount.', 'K', 9, '2021-12-02 09:16:39.918852+00', '2021-12-02 09:16:39.918873+00', NULL, NULL);
INSERT INTO public.mutation VALUES (52, 8, 'Replace #ifTrue: receiver with false in SmallBank>>#withdraw:', 34, 37, '	false ifTrue: [ 
	balance := balance - amount.
	^ true ].', 'K', 9, '2021-12-02 09:16:39.929143+00', '2021-12-02 09:16:39.929206+00', NULL, NULL);
INSERT INTO public.mutation VALUES (53, 9, 'Replace #ifTrue: receiver with true in SmallBank>>#withdraw:', 34, 37, '	true ifTrue: [ 
	balance := balance - amount.
	^ true ].', 'S', 9, '2021-12-02 09:16:39.934505+00', '2021-12-02 09:16:39.934527+00', NULL, NULL);
INSERT INTO public.mutation VALUES (54, 10, 'Replace #ifTrue: with #ifFalse: in SmallBank>>#withdraw:', 34, 37, '	balance >= amount ifFalse: [ 
	balance := balance - amount.
	^ true ].', 'K', 9, '2021-12-02 09:16:39.945671+00', '2021-12-02 09:16:39.945693+00', NULL, NULL);
INSERT INTO public.mutation VALUES (55, 1, 'Remove ^ in SmallBank2>>#balance', 39, 39, '	balance', 'K', 10, '2021-12-02 09:16:39.960341+00', '2021-12-02 09:16:39.960361+00', NULL, NULL);
INSERT INTO public.mutation VALUES (56, 2, 'Replace #''>='' with #= in SmallBank2>>#withdraw:', 56, 56, '	balance = amount', 'K', 10, '2021-12-02 09:16:39.964933+00', '2021-12-02 09:16:39.964953+00', NULL, NULL);
INSERT INTO public.mutation VALUES (73, 8, 'Replace #/ with #* in FakeObjectUnderTest>>#doCrash:', 14, 14, '	[ 1 * anInt ] on: Error do:  [ self doCrash  ]', 'S', 12, '2021-12-09 10:09:40.811475+00', '2021-12-13 10:12:52.873274+00', NULL, 1);
INSERT INTO public.mutation VALUES (58, 4, 'Replace #- with #+ in SmallBank2>>#withdraw:', 57, 57, '		ifTrue: [ balance := balance + amount ]', 'K', 10, '2021-12-02 09:16:39.987032+00', '2021-12-02 09:16:39.987054+00', NULL, NULL);
INSERT INTO public.mutation VALUES (60, 6, 'Replace #ifTrue:ifFalse: receiver with true in SmallBank2>>#withdraw:', 56, 58, '	true
	ifTrue: [ balance := balance - amount ]
	ifFalse: [ Error new signal ]', 'S', 10, '2021-12-02 09:16:39.996806+00', '2021-12-02 09:16:39.996838+00', NULL, NULL);
INSERT INTO public.mutation VALUES (61, 7, 'Replace #+ with #- in SmallBank2>>#deposit:', 46, 46, '	balance := balance - amount', 'K', 10, '2021-12-02 09:16:40.001304+00', '2021-12-02 09:16:40.001324+00', NULL, NULL);
INSERT INTO public.mutation VALUES (62, 8, 'Replace #< with #> in SmallBank2>>#deposit:', 44, 44, '	amount > 0', 'K', 10, '2021-12-02 09:16:40.006138+00', '2021-12-02 09:16:40.006163+00', NULL, NULL);
INSERT INTO public.mutation VALUES (65, 11, 'Replace #ifTrue: with #ifFalse: in SmallBank2>>#deposit:', 44, 45, '	amount < 0 ifFalse: [ Error new signal ].', 'K', 10, '2021-12-02 09:16:40.019139+00', '2021-12-02 09:16:40.019158+00', NULL, NULL);
INSERT INTO public.mutation VALUES (64, 10, 'Replace #ifTrue: receiver with true in SmallBank2>>#deposit:', 44, 45, '	true
	ifTrue: [ Error new signal ].', 'K', 10, '2021-12-02 09:16:40.014836+00', '2021-12-02 09:16:40.014856+00', NULL, NULL);
INSERT INTO public.mutation VALUES (77, 2, 'Replace #+ with #- in SmallBank>>#deposit:', 17, 17, '	balance := balance - amount', 'K', 14, '2021-12-09 10:09:40.858027+00', '2021-12-09 10:09:40.858048+00', NULL, NULL);
INSERT INTO public.mutation VALUES (59, 5, 'Replace #ifTrue:ifFalse: receiver with false in SmallBank2>>#withdraw:', 56, 58, '	false
	ifTrue: [ balance := balance - amount ]
	ifFalse: [ Error new signal ]', 'K', 10, '2021-12-02 09:16:39.992407+00', '2021-12-02 09:16:39.992428+00', NULL, NULL);
INSERT INTO public.mutation VALUES (76, 1, 'Remove ^ in SmallBank>>#balance', 12, 12, '	balance', 'K', 14, '2021-12-09 10:09:40.853544+00', '2021-12-09 10:09:40.853566+00', NULL, NULL);
INSERT INTO public.mutation VALUES (79, 4, 'Remove ^ in SmallBank>>#withdraw:', 38, 38, '	false', 'S', 14, '2021-12-09 10:09:40.87205+00', '2021-12-13 12:16:34.992759+00', NULL, 2);
INSERT INTO public.mutation VALUES (78, 3, 'Remove ^ in SmallBank>>#withdraw:', 37, 37, '			true ].', 'S', 14, '2021-12-09 10:09:40.863222+00', '2021-12-13 12:16:47.421559+00', NULL, 2);
INSERT INTO public.mutation VALUES (81, 6, 'Replace #''>='' with #> in SmallBank>>#withdraw:', 34, 34, '	balance > amount', 'S', 14, '2021-12-09 10:09:40.88659+00', '2021-12-13 12:16:51.650135+00', NULL, 1);
INSERT INTO public.mutation VALUES (75, 10, 'Replace #/ with #* in FakeObjectUnderTest>>#doFreeze:', 24, 24, '	[ 1 * anInt ] on: Error do:  [ self doFreeze  ] ', 'S', 12, '2021-12-09 10:09:40.834538+00', '2022-01-19 14:53:22.080264+00', NULL, 1);
INSERT INTO public.mutation VALUES (71, 6, 'Replace #ifTrue:ifFalse: receiver with true in FakeObjectUnderTest>>#someAction:', 34, 34, '	true
	ifTrue: [ ^ 0 ]
	ifFalse: [ ^ 1 ]', 'S', 12, '2021-12-09 10:09:40.783649+00', '2021-12-09 10:09:40.78368+00', NULL, NULL);
INSERT INTO public.mutation VALUES (63, 9, 'Replace #ifTrue: receiver with false in SmallBank2>>#deposit:', 44, 45, '	false
	ifTrue: [ Error new signal ].', 'S', 10, '2021-12-02 09:16:40.010512+00', '2021-12-09 10:12:53.94508+00', NULL, NULL);
INSERT INTO public.mutation VALUES (80, 5, 'Replace #''>='' with #= in SmallBank>>#withdraw:', 34, 34, '	balance = amount', 'K', 14, '2021-12-09 10:09:40.881466+00', '2021-12-09 10:09:40.881487+00', NULL, NULL);
INSERT INTO public.mutation VALUES (67, 2, 'Remove ^ in FakeObjectUnderTest>>#someAction:', 34, 34, '	anInt = 0 ifTrue: [ 0 ] ifFalse: [ ^ 1 ]', 'S', 12, '2021-12-09 10:09:40.717911+00', '2021-12-09 10:09:40.717942+00', NULL, NULL);
INSERT INTO public.mutation VALUES (66, 1, 'Remove ^ in FakeObjectUnderTest>>#echo:', 29, 29, '	obj', 'S', 12, '2021-12-09 10:09:40.704692+00', '2021-12-09 10:09:40.704721+00', NULL, NULL);
INSERT INTO public.mutation VALUES (69, 4, 'Replace #= with #''~='' in FakeObjectUnderTest>>#someAction:', 34, 34, '	anInt ~= 0 ifTrue: [ ^ 0 ] ifFalse: [ ^ 1 ]', 'S', 12, '2021-12-09 10:09:40.751695+00', '2021-12-09 10:09:40.751726+00', NULL, NULL);
INSERT INTO public.mutation VALUES (68, 3, 'Remove ^ in FakeObjectUnderTest>>#someAction:', 34, 34, '	anInt = 0 ifTrue: [ ^ 0 ] ifFalse: [ 1 ]', 'S', 12, '2021-12-09 10:09:40.73509+00', '2021-12-09 10:09:40.735119+00', NULL, NULL);
INSERT INTO public.mutation VALUES (74, 9, 'Remove Exception Handler Operator in FakeObjectUnderTest>>#doFreeze:', 24, 24, '	[ 1 / anInt ] value ', 'S', 12, '2021-12-09 10:09:40.823759+00', '2021-12-09 10:09:40.823791+00', NULL, NULL);
INSERT INTO public.mutation VALUES (70, 5, 'Replace #ifTrue:ifFalse: receiver with false in FakeObjectUnderTest>>#someAction:', 34, 34, '	false
	ifTrue: [ ^ 0 ]
	ifFalse: [ ^ 1 ]', 'S', 12, '2021-12-09 10:09:40.767496+00', '2021-12-09 10:09:40.767531+00', NULL, NULL);
INSERT INTO public.mutation VALUES (72, 7, 'Remove Exception Handler Operator in FakeObjectUnderTest>>#doCrash:', 14, 14, '	[ 1 / anInt ] value', 'S', 12, '2021-12-09 10:09:40.800553+00', '2021-12-09 10:09:40.800576+00', NULL, NULL);
INSERT INTO public.mutation VALUES (96, 11, 'Replace #ifTrue:ifFalse: receiver with true in SmallBank2>>#withdraw:', 56, 58, '	true
	ifTrue: [ balance := balance - amount ]
	ifFalse: [ Error new signal ]', 'S', 15, '2021-12-09 10:09:40.996853+00', '2021-12-10 14:32:04.172551+00', NULL, 1);
INSERT INTO public.mutation VALUES (84, 9, 'Replace #ifTrue: receiver with true in SmallBank>>#withdraw:', 34, 37, '	true ifTrue: [ 
	balance := balance - amount.
	^ true ].', 'S', 14, '2021-12-09 10:09:40.909316+00', '2021-12-13 12:16:39.798082+00', NULL, 2);
INSERT INTO public.mutation VALUES (82, 7, 'Replace #- with #+ in SmallBank>>#withdraw:', 36, 36, '			balance := balance + amount.', 'K', 14, '2021-12-09 10:09:40.897212+00', '2021-12-09 10:09:40.897242+00', NULL, NULL);
INSERT INTO public.mutation VALUES (85, 10, 'Replace #ifTrue: with #ifFalse: in SmallBank>>#withdraw:', 34, 37, '	balance >= amount ifFalse: [ 
	balance := balance - amount.
	^ true ].', 'K', 14, '2021-12-09 10:09:40.918038+00', '2021-12-09 10:09:40.918059+00', NULL, NULL);
INSERT INTO public.mutation VALUES (91, 6, 'Replace #ifTrue: with #ifFalse: in SmallBank2>>#deposit:', 44, 45, '	amount < 0 ifFalse: [ Error new signal ].', 'K', 15, '2021-12-09 10:09:40.967529+00', '2021-12-09 10:09:40.967552+00', NULL, NULL);
INSERT INTO public.mutation VALUES (90, 5, 'Replace #ifTrue: receiver with true in SmallBank2>>#deposit:', 44, 45, '	true ifTrue: [ Error new signal ].', 'K', 15, '2021-12-09 10:09:40.962286+00', '2021-12-09 10:09:40.962322+00', NULL, NULL);
INSERT INTO public.mutation VALUES (92, 7, 'Replace #''>='' with #= in SmallBank2>>#withdraw:', 56, 56, '	balance = amount', 'K', 15, '2021-12-09 10:09:40.973605+00', '2021-12-09 10:09:40.973627+00', NULL, NULL);
INSERT INTO public.mutation VALUES (87, 2, 'Replace #+ with #- in SmallBank2>>#deposit:', 46, 46, '	balance := balance - amount', 'K', 15, '2021-12-09 10:09:40.936398+00', '2021-12-09 10:09:40.93642+00', NULL, NULL);
INSERT INTO public.mutation VALUES (86, 1, 'Remove ^ in SmallBank2>>#balance', 39, 39, '	balance', 'K', 15, '2021-12-09 10:09:40.930921+00', '2021-12-09 10:25:36.575997+00', NULL, NULL);
INSERT INTO public.mutation VALUES (88, 3, 'Replace #< with #> in SmallBank2>>#deposit:', 44, 44, '	amount > 0', 'K', 15, '2021-12-09 10:09:40.941714+00', '2021-12-09 10:09:40.94174+00', NULL, NULL);
INSERT INTO public.mutation VALUES (95, 10, 'Replace #ifTrue:ifFalse: receiver with false in SmallBank2>>#withdraw:', 56, 58, '	false
	ifTrue: [ balance := balance - amount ]
	ifFalse: [ Error new signal ]', 'K', 15, '2021-12-09 10:09:40.991765+00', '2021-12-09 10:09:40.991788+00', NULL, NULL);
INSERT INTO public.mutation VALUES (94, 9, 'Replace #- with #+ in SmallBank2>>#withdraw:', 57, 57, '		ifTrue: [ balance := balance + amount ]', 'K', 15, '2021-12-09 10:09:40.986836+00', '2021-12-09 10:25:33.341956+00', NULL, NULL);
INSERT INTO public.mutation VALUES (57, 3, 'Replace #''>='' with #> in SmallBank2>>#withdraw:', 56, 56, '	balance > amount', 'S', 10, '2021-12-02 09:16:39.977032+00', '2021-12-09 10:13:15.946774+00', NULL, NULL);
INSERT INTO public.mutation VALUES (83, 8, 'Replace #ifTrue: receiver with false in SmallBank>>#withdraw:', 34, 37, '	false ifTrue: [ 
	balance := balance - amount.
	^ true ].', 'K', 14, '2021-12-09 10:09:40.903908+00', '2021-12-09 10:09:40.903931+00', NULL, NULL);
INSERT INTO public.mutation VALUES (89, 4, 'Replace #ifTrue: receiver with false in SmallBank2>>#deposit:', 44, 45, '	false ifTrue: [ Error new signal ].', 'S', 15, '2021-12-09 10:09:40.948498+00', '2021-12-10 09:26:45.284063+00', NULL, 2);
INSERT INTO public.mutation VALUES (93, 8, 'Replace #''>='' with #> in SmallBank2>>#withdraw:', 56, 56, '	balance > amount', 'S', 15, '2021-12-09 10:09:40.977911+00', '2021-12-10 14:01:13.810278+00', NULL, 1);


--
-- Data for Name: mutant_coverage; Type: TABLE DATA; Schema: public; Owner: hpxeuyirmmyfuv
--

INSERT INTO public.mutant_coverage VALUES (1, '2021-12-09 10:09:40.71195+00', '2021-12-09 10:09:40.71198+00', 'testFreezeMe2', 'src/SmallAmpCI-Tests/FakeFreezingTest.class.st', 18, 1, 66);
INSERT INTO public.mutant_coverage VALUES (2, '2021-12-09 10:09:40.723968+00', '2021-12-09 10:09:40.723998+00', 'testSomeAction', 'src/SmallAmpCI-Tests/FakeCrashingTest.class.st', 18, 1, 67);
INSERT INTO public.mutant_coverage VALUES (3, '2021-12-09 10:09:40.729591+00', '2021-12-09 10:09:40.729622+00', 'testSomeAction', 'src/SmallAmpCI-Tests/FakeFreezingTest.class.st', 25, 1, 67);
INSERT INTO public.mutant_coverage VALUES (4, '2021-12-09 10:09:40.7406+00', '2021-12-09 10:09:40.740634+00', 'testSomeAction', 'src/SmallAmpCI-Tests/FakeFreezingTest.class.st', 25, 1, 68);
INSERT INTO public.mutant_coverage VALUES (5, '2021-12-09 10:09:40.746132+00', '2021-12-09 10:09:40.746177+00', 'testSomeAction', 'src/SmallAmpCI-Tests/FakeCrashingTest.class.st', 18, 1, 68);
INSERT INTO public.mutant_coverage VALUES (6, '2021-12-09 10:09:40.757047+00', '2021-12-09 10:09:40.757078+00', 'testSomeAction', 'src/SmallAmpCI-Tests/FakeCrashingTest.class.st', 18, 1, 69);
INSERT INTO public.mutant_coverage VALUES (7, '2021-12-09 10:09:40.762332+00', '2021-12-09 10:09:40.762371+00', 'testSomeAction', 'src/SmallAmpCI-Tests/FakeFreezingTest.class.st', 25, 1, 69);
INSERT INTO public.mutant_coverage VALUES (8, '2021-12-09 10:09:40.772984+00', '2021-12-09 10:09:40.773015+00', 'testSomeAction', 'src/SmallAmpCI-Tests/FakeCrashingTest.class.st', 18, 1, 70);
INSERT INTO public.mutant_coverage VALUES (9, '2021-12-09 10:09:40.778396+00', '2021-12-09 10:09:40.778428+00', 'testSomeAction', 'src/SmallAmpCI-Tests/FakeFreezingTest.class.st', 25, 1, 70);
INSERT INTO public.mutant_coverage VALUES (10, '2021-12-09 10:09:40.789368+00', '2021-12-09 10:09:40.789392+00', 'testSomeAction', 'src/SmallAmpCI-Tests/FakeCrashingTest.class.st', 18, 1, 71);
INSERT INTO public.mutant_coverage VALUES (11, '2021-12-09 10:09:40.795168+00', '2021-12-09 10:09:40.795192+00', 'testSomeAction', 'src/SmallAmpCI-Tests/FakeFreezingTest.class.st', 25, 1, 71);
INSERT INTO public.mutant_coverage VALUES (12, '2021-12-09 10:09:40.805952+00', '2021-12-09 10:09:40.805986+00', 'testCrashMe', 'src/SmallAmpCI-Tests/FakeCrashingTest.class.st', 13, 1, 72);
INSERT INTO public.mutant_coverage VALUES (13, '2021-12-09 10:09:40.817153+00', '2021-12-09 10:09:40.817184+00', 'testCrashMe', 'src/SmallAmpCI-Tests/FakeCrashingTest.class.st', 13, 1, 73);
INSERT INTO public.mutant_coverage VALUES (14, '2021-12-09 10:09:40.829223+00', '2021-12-09 10:09:40.829256+00', 'testFreezeMe', 'src/SmallAmpCI-Tests/FakeFreezingTest.class.st', 13, 1, 74);
INSERT INTO public.mutant_coverage VALUES (15, '2021-12-09 10:09:40.839008+00', '2021-12-09 10:09:40.839034+00', 'testFreezeMe', 'src/SmallAmpCI-Tests/FakeFreezingTest.class.st', 13, 1, 75);
INSERT INTO public.mutant_coverage VALUES (16, '2021-12-09 10:09:40.867748+00', '2021-12-09 10:09:40.867771+00', 'testWithdraw', 'src/SmallBank-Tests/SmallBankTest.class.st', 24, 1, 78);
INSERT INTO public.mutant_coverage VALUES (17, '2021-12-09 10:09:40.87677+00', '2021-12-09 10:09:40.876793+00', 'testWithdraw', 'src/SmallBank-Tests/SmallBankTest.class.st', 24, 1, 79);
INSERT INTO public.mutant_coverage VALUES (18, '2021-12-09 10:09:40.892333+00', '2021-12-09 10:09:40.892365+00', 'testWithdraw', 'src/SmallBank-Tests/SmallBankTest.class.st', 24, 1, 81);
INSERT INTO public.mutant_coverage VALUES (19, '2021-12-09 10:09:40.913727+00', '2021-12-09 10:09:40.913748+00', 'testWithdraw', 'src/SmallBank-Tests/SmallBankTest.class.st', 24, 1, 84);
INSERT INTO public.mutant_coverage VALUES (20, '2021-12-09 10:09:40.953132+00', '2021-12-09 10:09:40.953156+00', 'testDeposit', 'src/SmallBank-Tests/SmallBank2Test.class.st', 8, 1, 89);
INSERT INTO public.mutant_coverage VALUES (21, '2021-12-09 10:09:40.957629+00', '2021-12-09 10:09:40.957652+00', 'testWithdraw', 'src/SmallBank-Tests/SmallBank2Test.class.st', 29, 1, 89);
INSERT INTO public.mutant_coverage VALUES (22, '2021-12-09 10:09:40.982541+00', '2021-12-09 10:09:40.982564+00', 'testWithdraw', 'src/SmallBank-Tests/SmallBank2Test.class.st', 29, 1, 93);
INSERT INTO public.mutant_coverage VALUES (23, '2021-12-09 10:09:41.003008+00', '2021-12-09 10:09:41.00304+00', 'testWithdraw', 'src/SmallBank-Tests/SmallBank2Test.class.st', 29, 1, 96);


--
-- Data for Name: project_token; Type: TABLE DATA; Schema: public; Owner: hpxeuyirmmyfuv
--

INSERT INTO public.project_token VALUES (1, '2021-11-08 20:28:33.571944+00', '2021-11-08 20:28:33.571991+00', 'Mehrdad', '85351620962c5f9b923073b1fd8a0053cd2b6e75d8eb195c5e5ee42526edd9ec', 3, 1, '2022-01-07 20:21:26+00');


--
-- Data for Name: project_user; Type: TABLE DATA; Schema: public; Owner: hpxeuyirmmyfuv
--

INSERT INTO public.project_user VALUES (1, '2021-12-07 00:24:49.38311+00', '2021-12-07 00:24:49.383144+00', 'O', 3, 1);


--
-- Data for Name: user_profile; Type: TABLE DATA; Schema: public; Owner: hpxeuyirmmyfuv
--

INSERT INTO public.user_profile VALUES (2, '2021-12-07 00:28:54.431737+00', '2021-12-07 00:28:54.431765+00', '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', 1);


--
-- Name: auth_user_id_seq; Type: SEQUENCE SET; Schema: public; Owner: hpxeuyirmmyfuv
--

SELECT pg_catalog.setval('public.auth_user_id_seq', 1, true);


--
-- Name: file_id_seq; Type: SEQUENCE SET; Schema: public; Owner: hpxeuyirmmyfuv
--

SELECT pg_catalog.setval('public.file_id_seq', 15, true);


--
-- Name: job_id_seq; Type: SEQUENCE SET; Schema: public; Owner: hpxeuyirmmyfuv
--

SELECT pg_catalog.setval('public.job_id_seq', 9, true);


--
-- Name: job_projectmembership_id_seq; Type: SEQUENCE SET; Schema: public; Owner: hpxeuyirmmyfuv
--

SELECT pg_catalog.setval('public.job_projectmembership_id_seq', 1, true);


--
-- Name: mutant_coverage_id_seq; Type: SEQUENCE SET; Schema: public; Owner: hpxeuyirmmyfuv
--

SELECT pg_catalog.setval('public.mutant_coverage_id_seq', 23, true);


--
-- Name: mutation_id_seq; Type: SEQUENCE SET; Schema: public; Owner: hpxeuyirmmyfuv
--

SELECT pg_catalog.setval('public.mutation_id_seq', 96, true);


--
-- Name: project_id_seq; Type: SEQUENCE SET; Schema: public; Owner: hpxeuyirmmyfuv
--

SELECT pg_catalog.setval('public.project_id_seq', 3, true);


--
-- Name: project_token_id_seq; Type: SEQUENCE SET; Schema: public; Owner: hpxeuyirmmyfuv
--

SELECT pg_catalog.setval('public.project_token_id_seq', 1, true);


--
-- Name: user_profile_id_seq; Type: SEQUENCE SET; Schema: public; Owner: hpxeuyirmmyfuv
--

SELECT pg_catalog.setval('public.user_profile_id_seq', 2, true);


--
-- PostgreSQL database dump complete
--

