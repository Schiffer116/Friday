\c flight_ticket_management;

-- Insert 200 tickets for the flights
INSERT INTO ticket (flight_id, passenger_name, passenger_id, phone_number, class, passenger_type, book_time, status, note) VALUES
(1, 'John Doe', '001201000001', '123-456-7890', '1', 'adult', '2023-01-01', 'booked', 'Window seat'),
(1, 'Jane Smith', '001201000002', '123-456-7891', '2', 'child', '2023-01-02', 'confirmed', 'Aisle seat'),
(1, 'Mike Johnson', '001201000003', '123-456-7892', '1', 'adult', '2023-01-03', 'cancelled', 'Extra legroom'),
(1, 'Alice Williams', '001201000004', '123-456-7893', '2', 'adult', '2023-01-04', 'booked', 'Aisle seat'),
(1, 'Robert Brown', '001201000005', '123-456-7894', '1', 'child', '2023-01-05', 'confirmed', 'Window seat'),
(1, 'Jessica Jones', '001201000006', '123-456-7895', '2', 'infant', '2023-01-06', 'booked', 'Bassinet seat'),
(2, 'Sarah Brown', '001201000007', '123-456-7896', '2', 'infant', '2023-01-07', 'booked', 'Bassinet seat'),
(2, 'Chris Davis', '001201000008', '123-456-7897', '1', 'adult', '2023-01-08', 'confirmed', 'Window seat'),
(2, 'Patricia Garcia', '001201000009', '123-456-7898', '2', 'child', '2023-01-09', 'booked', 'Aisle seat'),
(2, 'Michael Martinez', '001201000010', '123-456-7899', '1', 'adult', '2023-01-10', 'confirmed', 'Window seat'),
(2, 'Laura Wilson', '001201000011', '123-456-7900', '2', 'child', '2023-01-11', 'cancelled', 'Aisle seat'),
(2, 'Daniel Anderson', '001201000012', '123-456-7901', '1', 'adult', '2023-01-12', 'booked', 'Extra legroom'),
(3, 'Robert Martinez', '001201000013', '123-456-7902', '1', 'adult', '2023-01-13', 'booked', 'Window seat'),
(3, 'Linda Hernandez', '001201000014', '123-456-7903', '2', 'child', '2023-01-14', 'confirmed', 'Aisle seat'),
(3, 'Kevin Clark', '001201000015', '123-456-7904', '1', 'adult', '2023-01-15', 'cancelled', 'Extra legroom'),
(3, 'Nancy Rodriguez', '001201000016', '123-456-7905', '2', 'adult', '2023-01-16', 'booked', 'Aisle seat'),
(3, 'Matthew Lewis', '001201000017', '123-456-7906', '1', 'child', '2023-01-17', 'confirmed', 'Window seat'),
(3, 'Emma Hall', '001201000018', '123-456-7907', '2', 'infant', '2023-01-18', 'booked', 'Bassinet seat'),
(4, 'Sandra Walker', '001201000019', '123-456-7908', '2', 'infant', '2023-01-19', 'booked', 'Bassinet seat'),
(4, 'Gary Allen', '001201000020', '123-456-7909', '1', 'adult', '2023-01-20', 'confirmed', 'Window seat'),
(4, 'Donna Young', '001201000021', '123-456-7910', '2', 'child', '2023-01-21', 'booked', 'Aisle seat'),
(4, 'George King', '001201000022', '123-456-7911', '1', 'adult', '2023-01-22', 'confirmed', 'Window seat'),
(4, 'Karen Wright', '001201000023', '123-456-7912', '2', 'child', '2023-01-23', 'cancelled', 'Aisle seat'),
(4, 'Brian Lopez', '001201000024', '123-456-7913', '1', 'adult', '2023-01-24', 'booked', 'Extra legroom'),
(5, 'Ashley Hill', '001201000025', '123-456-7914', '1', 'adult', '2023-01-25', 'booked', 'Window seat'),
(5, 'Ryan Scott', '001201000026', '123-456-7915', '2', 'child', '2023-01-26', 'confirmed', 'Aisle seat'),
(5, 'Megan Green', '001201000027', '123-456-7916', '1', 'adult', '2023-01-27', 'cancelled', 'Extra legroom'),
(5, 'Olivia Adams', '001201000028', '123-456-7917', '2', 'adult', '2023-01-28', 'booked', 'Aisle seat'),
(5, 'Christopher Baker', '001201000029', '123-456-7918', '1', 'child', '2023-01-29', 'confirmed', 'Window seat'),
(5, 'Amy Gonzalez', '001201000030', '123-456-7919', '2', 'infant', '2023-01-30', 'booked', 'Bassinet seat'),
(6, 'Lisa Nelson', '001201000031', '123-456-7920', '2', 'infant', '2023-01-31', 'booked', 'Bassinet seat'),
(6, 'Jason Carter', '001201000032', '123-456-7921', '1', 'adult', '2023-02-01', 'confirmed', 'Window seat'),
(6, 'Elizabeth Mitchell', '001201000033', '123-456-7922', '2', 'child', '2023-02-02', 'booked', 'Aisle seat'),
(6, 'Steven Perez', '001201000034', '123-456-7923', '1', 'adult', '2023-02-03', 'confirmed', 'Window seat'),
(6, 'Mary Roberts', '001201000035', '123-456-7924', '2', 'child', '2023-02-04', 'cancelled', 'Aisle seat'),
(6, 'Anthony Phillips', '001201000036', '123-456-7925', '1', 'adult', '2023-02-05', 'booked', 'Extra legroom'),
(7, 'Jennifer Campbell', '001201000037', '123-456-7926', '1', 'adult', '2023-02-06', 'booked', 'Window seat'),
(7, 'Jacob Parker', '001201000038', '123-456-7927', '2', 'child', '2023-02-07', 'confirmed', 'Aisle seat'),
(7, 'Sophia Evans', '001201000039', '123-456-7928', '1', 'adult', '2023-02-08', 'cancelled', 'Extra legroom'),
(7, 'Ethan Edwards', '001201000040', '123-456-7929', '2', 'adult', '2023-02-09', 'booked', 'Aisle seat'),
(7, 'Isabella Collins', '001201000041', '123-456-7930', '1', 'child', '2023-02-10', 'confirmed', 'Window seat'),
(7, 'James Stewart', '001201000042', '123-456-7931', '2', 'infant', '2023-02-11', 'booked', 'Bassinet seat'),
(8, 'Mia Sanchez', '001201000043', '123-456-7932', '2', 'infant', '2023-02-12', 'booked', 'Bassinet seat'),
(8, 'Alexander Morris', '001201000044', '123-456-7933', '1', 'adult', '2023-02-13', 'confirmed', 'Window seat'),
(8, 'Emily Rogers', '001201000045', '123-456-7934', '2', 'child', '2023-02-14', 'booked', 'Aisle seat'),
(8, 'Daniel Reed', '001201000046', '123-456-7935', '1', 'adult', '2023-02-15', 'confirmed', 'Window seat'),
(8, 'Ava Cook', '001201000047', '123-456-7936', '2', 'child', '2023-02-16', 'cancelled', 'Aisle seat'),
(8, 'David Morgan', '001201000048', '123-456-7937', '1', 'adult', '2023-02-17', 'booked', 'Extra legroom'),
(9, 'Ella Peterson', '001201000049', '123-456-7938', '1', 'adult', '2023-02-18', 'booked', 'Window seat'),
(9, 'Joshua Cooper', '001201000050', '123-456-7939', '2', 'child', '2023-02-19', 'confirmed', 'Aisle seat'),
(9, 'Aiden Bailey', '001201000051', '123-456-7940', '1', 'adult', '2023-02-20', 'cancelled', 'Extra legroom'),
(9, 'Grace Richardson', '001201000052', '123-456-7941', '2', 'adult', '2023-02-21', 'booked', 'Aisle seat'),
(9, 'Lucas Bennett', '001201000053', '123-456-7942', '1', 'child', '2023-02-22', 'confirmed', 'Window seat'),
(9, 'Chloe Cox', '001201000054', '123-456-7943', '2', 'infant', '2023-02-23', 'booked', 'Bassinet seat'),
(10, 'Sebastian Lee', '001201000055', '123-456-7944', '2', 'infant', '2023-02-24', 'booked', 'Bassinet seat'),
(10, 'Sofia Ward', '001201000056', '123-456-7945', '1', 'adult', '2023-02-25', 'confirmed', 'Window seat'),
(10, 'Levi Gray', '001201000057', '123-456-7946', '2', 'child', '2023-02-26', 'booked', 'Aisle seat'),
(10, 'Mason James', '001201000058', '123-456-7947', '1', 'adult', '2023-02-27', 'confirmed', 'Window seat'),
(10, 'Zoe Hughes', '001201000059', '123-456-7948', '2', 'child', '2023-02-28', 'cancelled', 'Aisle seat'),
(10, 'Evelyn Griffin', '001201000060', '123-456-7949', '1', 'adult', '2023-03-01', 'booked', 'Extra legroom'),
(11, 'Harper Hill', '001201000061', '123-456-7950', '1', 'adult', '2023-03-02', 'booked', 'Window seat'),
(11, 'Elijah Bell', '001201000062', '123-456-7951', '2', 'child', '2023-03-03', 'confirmed', 'Aisle seat'),
(11, 'Aria Stewart', '001201000063', '123-456-7952', '1', 'adult', '2023-03-04', 'cancelled', 'Extra legroom'),
(11, 'Benjamin Howard', '001201000064', '123-456-7953', '2', 'adult', '2023-03-05', 'booked', 'Aisle seat'),
(11, 'Eleanor Torres', '001201000065', '123-456-7954', '1', 'child', '2023-03-06', 'confirmed', 'Window seat'),
(11, 'Aubrey Nelson', '001201000066', '123-456-7955', '2', 'infant', '2023-03-07', 'booked', 'Bassinet seat'),
(12, 'William Foster', '001201000067', '123-456-7956', '2', 'infant', '2023-03-08', 'booked', 'Bassinet seat'),
(12, 'Charlotte Flores', '001201000068', '123-456-7957', '1', 'adult', '2023-03-09', 'confirmed', 'Window seat'),
(12, 'Henry Sanders', '001201000069', '123-456-7958', '2', 'child', '2023-03-10', 'booked', 'Aisle seat'),
(12, 'Victoria Price', '001201000070', '123-456-7959', '1', 'adult', '2023-03-11', 'confirmed', 'Window seat'),
(12, 'Thomas Murphy', '001201000071', '123-456-7960', '2', 'child', '2023-03-12', 'cancelled', 'Aisle seat'),
(12, 'Nora Barnes', '001201000072', '123-456-7961', '1', 'adult', '2023-03-13', 'booked', 'Extra legroom'),
(13, 'Oliver Perry', '001201000073', '123-456-7962', '1', 'adult', '2023-03-14', 'booked', 'Window seat'),
(13, 'Liam Brooks', '001201000074', '123-456-7963', '2', 'child', '2023-03-15', 'confirmed', 'Aisle seat'),
(13, 'Emma Sanders', '001201000075', '123-456-7964', '1', 'adult', '2023-03-16', 'cancelled', 'Extra legroom'),
(13, 'James Reed', '001201000076', '123-456-7965', '2', 'adult', '2023-03-17', 'booked', 'Aisle seat'),
(13, 'Grace Ross', '001201000077', '123-456-7966', '1', 'child', '2023-03-18', 'confirmed', 'Window seat'),
(13, 'Amelia Bryant', '001201000078', '123-456-7967', '2', 'infant', '2023-03-19', 'booked', 'Bassinet seat'),
(14, 'Lucas Powell', '001201000079', '123-456-7968', '2', 'infant', '2023-03-20', 'booked', 'Bassinet seat'),
(14, 'Alexander Parker', '001201000080', '123-456-7969', '1', 'adult', '2023-03-21', 'confirmed', 'Window seat'),
(14, 'Emily Rivera', '001201000081', '123-456-7970', '2', 'child', '2023-03-22', 'booked', 'Aisle seat'),
(14, 'Daniel Collins', '001201000082', '123-456-7971', '1', 'adult', '2023-03-23', 'confirmed', 'Window seat'),
(14, 'Ava Watson', '001201000083', '123-456-7972', '2', 'child', '2023-03-24', 'cancelled', 'Aisle seat'),
(14, 'David Lee', '001201000084', '123-456-7973', '1', 'adult', '2023-03-25', 'booked', 'Extra legroom'),
(15, 'Sebastian Scott', '001201000085', '123-456-7974', '1', 'adult', '2023-03-26', 'booked', 'Window seat'),
(15, 'Sofia King', '001201000086', '123-456-7975', '2', 'child', '2023-03-27', 'confirmed', 'Aisle seat'),
(15, 'Levi Green', '001201000087', '123-456-7976', '1', 'adult', '2023-03-28', 'cancelled', 'Extra legroom'),
(15, 'Mason Wright', '001201000088', '123-456-7977', '2', 'adult', '2023-03-29', 'booked', 'Aisle seat'),
(15, 'Zoe Turner', '001201000089', '123-456-7978', '1', 'child', '2023-03-30', 'confirmed', 'Window seat'),
(15, 'Evelyn Torres', '001201000090', '123-456-7979', '2', 'infant', '2023-03-31', 'booked', 'Bassinet seat'),
(16, 'Harper Gonzalez', '001201000091', '123-456-7980', '2', 'infant', '2023-04-01', 'booked', 'Bassinet seat'),
(16, 'Elijah Anderson', '001201000092', '123-456-7981', '1', 'adult', '2023-04-02', 'confirmed', 'Window seat'),
(16, 'Aria Moore', '001201000093', '123-456-7982', '2', 'child', '2023-04-03', 'booked', 'Aisle seat'),
(16, 'Benjamin Taylor', '001201000094', '123-456-7983', '1', 'adult', '2023-04-04', 'confirmed', 'Window seat'),
(16, 'Eleanor Thomas', '001201000095', '123-456-7984', '2', 'child', '2023-04-05', 'cancelled', 'Aisle seat'),
(16, 'Aubrey Jackson', '001201000096', '123-456-7985', '1', 'adult', '2023-04-06', 'booked', 'Extra legroom'),
(17, 'William White', '001201000097', '123-456-7986', '1', 'adult', '2023-04-07', 'booked', 'Window seat'),
(17, 'Charlotte Harris', '001201000098', '123-456-7987', '2', 'child', '2023-04-08', 'confirmed', 'Aisle seat'),
(17, 'Henry Martin', '001201000099', '123-456-7988', '1', 'adult', '2023-04-09', 'cancelled', 'Extra legroom'),
(17, 'Victoria Thompson', '001201000100', '123-456-7989', '2', 'adult', '2023-04-10', 'booked', 'Aisle seat'),
(17, 'Thomas Martinez', '001201000101', '123-456-7990', '1', 'child', '2023-04-11', 'confirmed', 'Window seat'),
(17, 'Nora Martinez', '001201000102', '123-456-7991', '2', 'infant', '2023-04-12', 'booked', 'Bassinet seat'),
(17, 'Victoria Thompson', '001201000100', '123-456-7989', '2', 'adult', '2023-04-10', 'booked', 'Aisle seat'),
(17, 'Thomas Martinez', '001201000101', '123-456-7990', '1', 'child', '2023-04-11', 'confirmed', 'Window seat'),
(17, 'Nora Martinez', '001201000102', '123-456-7991', '2', 'infant', '2023-04-12', 'booked', 'Bassinet seat'),
(18, 'Oliver Jackson', '001201000103', '123-456-7992', '2', 'infant', '2023-04-13', 'booked', 'Bassinet seat'),
(18, 'Liam Davis', '001201000104', '123-456-7993', '1', 'adult', '2023-04-14', 'confirmed', 'Window seat'),
(18, 'Emma Garcia', '001201000105', '123-456-7994', '2', 'child', '2023-04-15', 'booked', 'Aisle seat'),
(18, 'James Rodriguez', '001201000106', '123-456-7995', '1', 'adult', '2023-04-16', 'confirmed', 'Window seat'),
(18, 'Grace Harris', '001201000107', '123-456-7996', '2', 'child', '2023-04-17', 'cancelled', 'Aisle seat'),
(18, 'Amelia Thompson', '001201000108', '123-456-7997', '1', 'adult', '2023-04-18', 'booked', 'Extra legroom'),
(19, 'Lucas Martinez', '001201000109', '123-456-7998', '1', 'adult', '2023-04-19', 'booked', 'Window seat'),
(19, 'Alexander Anderson', '001201000110', '123-456-7999', '2', 'child', '2023-04-20', 'confirmed', 'Aisle seat'),
(19, 'Emily Moore', '001201000111', '123-456-8000', '1', 'adult', '2023-04-21', 'cancelled', 'Extra legroom'),
(19, 'Daniel Wilson', '001201000112', '123-456-8001', '2', 'adult', '2023-04-22', 'booked', 'Aisle seat'),
(19, 'Ava Taylor', '001201000113', '123-456-8002', '1', 'child', '2023-04-23', 'confirmed', 'Window seat'),
(19, 'David Brown', '001201000114', '123-456-8003', '2', 'infant', '2023-04-24', 'booked', 'Bassinet seat'),
(20, 'Sebastian Johnson', '001201000115', '123-456-8004', '2', 'infant', '2023-04-25', 'booked', 'Bassinet seat'),
(20, 'Sofia White', '001201000116', '123-456-8005', '1', 'adult', '2023-04-26', 'confirmed', 'Window seat'),
(20, 'Levi Harris', '001201000117', '123-456-8006', '2', 'child', '2023-04-27', 'booked', 'Aisle seat'),
(20, 'Mason Martin', '001201000118', '123-456-8007', '1', 'adult', '2023-04-28', 'confirmed', 'Window seat'),
(20, 'Zoe Jackson', '001201000119', '123-456-8008', '2', 'child', '2023-04-29', 'cancelled', 'Aisle seat'),
(20, 'Evelyn Thompson', '001201000120', '123-456-8009', '1', 'adult', '2023-04-30', 'booked', 'Extra legroom'),
(21, 'Harper Garcia', '001201000121', '123-456-8010', '1', 'adult', '2023-05-01', 'booked', 'Window seat'),
(21, 'Elijah Martinez', '001201000122', '123-456-8011', '2', 'child', '2023-05-02', 'confirmed', 'Aisle seat'),
(21, 'Aria Rodriguez', '001201000123', '123-456-8012', '1', 'adult', '2023-05-03', 'cancelled', 'Extra legroom'),
(21, 'Benjamin Martinez', '001201000124', '123-456-8013', '2', 'adult', '2023-05-04', 'booked', 'Aisle seat'),
(21, 'Eleanor Anderson', '001201000125', '123-456-8014', '1', 'child', '2023-05-05', 'confirmed', 'Window seat'),
(21, 'Aubrey Martinez', '001201000126', '123-456-8015', '2', 'infant', '2023-05-06', 'booked', 'Bassinet seat'),
(22, 'William Harris', '001201000127', '123-456-8016', '2', 'infant', '2023-05-07', 'booked', 'Bassinet seat'),
(22, 'Charlotte White', '001201000128', '123-456-8017', '1', 'adult', '2023-05-08', 'confirmed', 'Window seat'),
(22, 'Henry Harris', '001201000129', '123-456-8018', '2', 'child', '2023-05-09', 'booked', 'Aisle seat'),
(22, 'Victoria Harris', '001201000130', '123-456-8019', '1', 'adult', '2023-05-10', 'confirmed', 'Window seat'),
(22, 'Thomas Harris', '001201000131', '123-456-8020', '2', 'child', '2023-05-11', 'cancelled', 'Aisle seat'),
(22, 'Nora Harris', '001201000132', '123-456-8021', '1', 'adult', '2023-05-12', 'booked', 'Extra legroom'),
(23, 'Oliver Harris', '001201000133', '123-456-8022', '1', 'adult', '2023-05-13', 'booked', 'Window seat'),
(23, 'Liam Harris', '001201000134', '123-456-8023', '2', 'child', '2023-05-14', 'confirmed', 'Aisle seat'),
(23, 'Emma Harris', '001201000135', '123-456-8024', '1', 'adult', '2023-05-15', 'cancelled', 'Extra legroom'),
(23, 'James Harris', '001201000136', '123-456-8025', '2', 'adult', '2023-05-16', 'booked', 'Aisle seat'),
(23, 'Grace Harris', '001201000137', '123-456-8026', '1', 'child', '2023-05-17', 'confirmed', 'Window seat'),
(23, 'Amelia Harris', '001201000138', '123-456-8027', '2', 'infant', '2023-05-18', 'booked', 'Bassinet seat'),
(24, 'Lucas Harris', '001201000139', '123-456-8028', '2', 'infant', '2023-05-19', 'booked', 'Bassinet seat'),
(24, 'Alexander Harris', '001201000140', '123-456-8029', '1', 'adult', '2023-05-20', 'confirmed', 'Window seat'),
(24, 'Emily Harris', '001201000141', '123-456-8030', '2', 'child', '2023-05-21', 'booked', 'Aisle seat'),
(24, 'Daniel Harris', '001201000142', '123-456-8031', '1', 'adult', '2023-05-22', 'confirmed', 'Window seat'),
(24, 'Ava Harris', '001201000143', '123-456-8032', '2', 'child', '2023-05-23', 'cancelled', 'Aisle seat'),
(24, 'David Harris', '001201000144', '123-456-8033', '1', 'adult', '2023-05-24', 'booked', 'Extra legroom'),
(25, 'Sebastian Harris', '001201000145', '123-456-8034', '1', 'adult', '2023-05-25', 'booked', 'Window seat'),
(25, 'Sofia Harris', '001201000146', '123-456-8035', '2', 'child', '2023-05-26', 'confirmed', 'Aisle seat'),
(25, 'Levi Harris', '001201000147', '123-456-8036', '1', 'adult', '2023-05-27', 'cancelled', 'Extra legroom'),
(25, 'Mason Harris', '001201000148', '123-456-8037', '2', 'adult', '2023-05-28', 'booked', 'Aisle seat'),
(25, 'Zoe Harris', '001201000149', '123-456-8038', '1', 'child', '2023-05-29', 'confirmed', 'Window seat'),
(25, 'Evelyn Harris', '001201000150', '123-456-8039', '2', 'infant', '2023-05-30', 'booked', 'Bassinet seat'),
(26, 'Harper Harris', '001201000151', '123-456-8040', '2', 'infant', '2023-05-31', 'booked', 'Bassinet seat'),
(26, 'Elijah Harris', '001201000152', '123-456-8041', '1', 'adult', '2023-06-01', 'confirmed', 'Window seat'),
(26, 'Aria Harris', '001201000153', '123-456-8042', '2', 'child', '2023-06-02', 'booked', 'Aisle seat'),
(26, 'Benjamin Harris', '001201000154', '123-456-8043', '1', 'adult', '2023-06-03', 'confirmed', 'Window seat'),
(26, 'Eleanor Harris', '001201000155', '123-456-8044', '2', 'child', '2023-06-04', 'cancelled', 'Aisle seat'),
(26, 'Aubrey Harris', '001201000156', '123-456-8045', '1', 'adult', '2023-06-05', 'booked', 'Extra legroom'),
(27, 'William Harris', '001201000157', '123-456-8046', '1', 'adult', '2023-06-06', 'booked', 'Window seat'),
(27, 'Charlotte Harris', '001201000158', '123-456-8047', '2', 'child', '2023-06-07', 'confirmed', 'Aisle seat'),
(27, 'Henry Harris', '001201000159', '123-456-8048', '1', 'adult', '2023-06-08', 'cancelled', 'Extra legroom'),
(27, 'Victoria Harris', '001201000160', '123-456-8049', '2', 'adult', '2023-06-09', 'booked', 'Aisle seat'),
(27, 'Thomas Harris', '001201000161', '123-456-8050', '1', 'child', '2023-06-10', 'confirmed', 'Window seat'),
(27, 'Nora Harris', '001201000162', '123-456-8051', '2', 'infant', '2023-06-11', 'booked', 'Bassinet seat'),
(28, 'Oliver Harris', '001201000163', '123-456-8052', '2', 'infant', '2023-06-12', 'booked', 'Bassinet seat'),
(28, 'Liam Harris', '001201000164', '123-456-8053', '1', 'adult', '2023-06-13', 'confirmed', 'Window seat'),
(28, 'Emma Harris', '001201000165', '123-456-8054', '2', 'child', '2023-06-14', 'booked', 'Aisle seat'),
(28, 'James Harris', '001201000166', '123-456-8055', '1', 'adult', '2023-06-15', 'confirmed', 'Window seat'),
(28, 'Grace Harris', '001201000167', '123-456-8056', '2', 'child', '2023-06-16', 'cancelled', 'Aisle seat'),
(28, 'Amelia Harris', '001201000168', '123-456-8057', '1', 'adult', '2023-06-17', 'booked', 'Extra legroom'),
(29, 'Lucas Harris', '001201000169', '123-456-8058', '1', 'adult', '2023-06-18', 'booked', 'Window seat'),
(29, 'Alexander Harris', '001201000170', '123-456-8059', '2', 'child', '2023-06-19', 'confirmed', 'Aisle seat'),
(29, 'Emily Harris', '001201000171', '123-456-8060', '1', 'adult', '2023-06-20', 'cancelled', 'Extra legroom'),
(29, 'Daniel Harris', '001201000172', '123-456-8061', '2', 'adult', '2023-06-21', 'booked', 'Aisle seat'),
(29, 'Ava Harris', '001201000173', '123-456-8062', '1', 'child', '2023-06-22', 'confirmed', 'Window seat'),
(29, 'David Harris', '001201000174', '123-456-8063', '2', 'infant', '2023-06-23', 'booked', 'Bassinet seat'),
(30, 'Sebastian Harris', '001201000175', '123-456-8064', '2', 'infant', '2023-06-24', 'booked', 'Bassinet seat'),
(30, 'Sofia Harris', '001201000176', '123-456-8065', '1', 'adult', '2023-06-25', 'confirmed', 'Window seat'),
(30, 'Levi Harris', '001201000177', '123-456-8066', '2', 'child', '2023-06-26', 'booked', 'Aisle seat'),
(30, 'Mason Harris', '001201000178', '123-456-8067', '1', 'adult', '2023-06-27', 'confirmed', 'Window seat'),
(30, 'Zoe Harris', '001201000179', '123-456-8068', '2', 'child', '2023-06-28', 'cancelled', 'Aisle seat'),
(30, 'Evelyn Harris', '001201000180', '123-456-8069', '1', 'adult', '2023-06-29', 'booked', 'Extra legroom'),
(31, 'Harper Harris', '001201000181', '123-456-8070', '1', 'adult', '2023-06-30', 'booked', 'Window seat'),
(31, 'Elijah Harris', '001201000182', '123-456-8071', '2', 'child', '2023-07-01', 'confirmed', 'Aisle seat'),
(31, 'Aria Harris', '001201000183', '123-456-8072', '1', 'adult', '2023-07-02', 'cancelled', 'Extra legroom'),
(31, 'Benjamin Harris', '001201000184', '123-456-8073', '2', 'adult', '2023-07-03', 'booked', 'Aisle seat'),
(31, 'Eleanor Harris', '001201000185', '123-456-8074', '1', 'child', '2023-07-04', 'confirmed', 'Window seat'),
(31, 'Aubrey Harris', '001201000186', '123-456-8075', '2', 'infant', '2023-07-05', 'booked', 'Bassinet seat'),
(32, 'William Harris', '001201000187', '123-456-8076', '2', 'infant', '2023-07-06', 'booked', 'Bassinet seat'),
(32, 'Charlotte Harris', '001201000188', '123-456-8077', '1', 'adult', '2023-07-07', 'confirmed', 'Window seat'),
(32, 'Henry Harris', '001201000189', '123-456-8078', '2', 'child', '2023-07-08', 'booked', 'Aisle seat'),
(32, 'Victoria Harris', '001201000190', '123-456-8079', '1', 'adult', '2023-07-09', 'confirmed', 'Window seat'),
(32, 'Thomas Harris', '001201000191', '123-456-8080', '2', 'child', '2023-07-10', 'cancelled', 'Aisle seat'),
(32, 'Nora Harris', '001201000192', '123-456-8081', '1', 'adult', '2023-07-11', 'booked', 'Extra legroom'),
(33, 'Oliver Harris', '001201000193', '123-456-8082', '1', 'adult', '2023-07-12', 'booked', 'Window seat'),
(33, 'Liam Harris', '001201000194', '123-456-8083', '2', 'child', '2023-07-13', 'confirmed', 'Aisle seat'),
(33, 'Emma Harris', '001201000195', '123-456-8084', '1', 'adult', '2023-07-14', 'cancelled', 'Extra legroom'),
(33, 'James Harris', '001201000196', '123-456-8085', '2', 'adult', '2023-07-15', 'booked', 'Aisle seat'),
(33, 'Grace Harris', '001201000197', '123-456-8086', '1', 'child', '2023-07-16', 'confirmed', 'Window seat'),
(33, 'Amelia Harris', '001201000198', '123-456-8087', '2', 'infant', '2023-07-17', 'booked', 'Bassinet seat'),
(34, 'Lucas Harris', '001201000199', '123-456-8088', '2', 'infant', '2023-07-18', 'booked', 'Bassinet seat'),
(34, 'Alexander Harris', '001201000200', '123-456-8089', '1', 'adult', '2023-07-19', 'confirmed', 'Window seat'),
(34, 'Charlotte Black', '001201001001', '123-456-8090', '2', 'child', '2023-07-20', 'booked', 'Aisle seat'),
(34, 'Henry White', '001201001002', '123-456-8091', '1', 'adult', '2023-07-21', 'confirmed', 'Window seat'),
(34, 'Victoria Green', '001201001003', '123-456-8092', '2', 'child', '2023-07-22', 'cancelled', 'Aisle seat'),
(34, 'Thomas Red', '001201001004', '123-456-8093', '1', 'adult', '2023-07-23', 'booked', 'Extra legroom'),
(34, 'Nora Blue', '001201001005', '123-456-8094', '2', 'infant', '2023-07-24', 'booked', 'Bassinet seat'),
(35, 'Oliver Gray', '001201001006', '123-456-8095', '1', 'adult', '2023-07-25', 'booked', 'Window seat'),
(35, 'Liam Brown', '001201001007', '123-456-8096', '2', 'child', '2023-07-26', 'confirmed', 'Aisle seat'),
(35, 'Emma White', '001201001008', '123-456-8097', '1', 'adult', '2023-07-27', 'cancelled', 'Extra legroom'),
(35, 'James Black', '001201001009', '123-456-8098', '2', 'adult', '2023-07-28', 'booked', 'Aisle seat'),
(35, 'Grace Blue', '001201001010', '123-456-8099', '1', 'child', '2023-07-29', 'confirmed', 'Window seat'),
(36, 'Amelia Red', '001201001011', '123-456-8100', '2', 'infant', '2023-07-30', 'booked', 'Bassinet seat'),
(36, 'Lucas Green', '001201001012', '123-456-8101', '1', 'adult', '2023-07-31', 'confirmed', 'Window seat'),
(36, 'Alexander White', '001201001013', '123-456-8102', '2', 'child', '2023-08-01', 'booked', 'Aisle seat'),
(36, 'Emily Black', '001201001014', '123-456-8103', '1', 'adult', '2023-08-02', 'confirmed', 'Window seat'),
(36, 'Daniel Blue', '001201001015', '123-456-8104', '2', 'child', '2023-08-03', 'cancelled', 'Aisle seat'),
(36, 'Ava Red', '001201001016', '123-456-8105', '1', 'adult', '2023-08-04', 'booked', 'Extra legroom'),
(37, 'David Green', '001201001017', '123-456-8106', '2', 'infant', '2023-08-05', 'booked', 'Bassinet seat'),
(37, 'Sebastian White', '001201001018', '123-456-8107', '1', 'adult', '2023-08-06', 'confirmed', 'Window seat'),
(37, 'Sofia Black', '001201001019', '123-456-8108', '2', 'child', '2023-08-07', 'booked', 'Aisle seat'),
(37, 'Levi Blue', '001201001020', '123-456-8109', '1', 'adult', '2023-08-08', 'confirmed', 'Window seat'),
(37, 'Mason Red', '001201001021', '123-456-8110', '2', 'child', '2023-08-09', 'cancelled', 'Aisle seat'),
(37, 'Zoe Green', '001201001022', '123-456-8111', '1', 'adult', '2023-08-10', 'booked', 'Extra legroom'),
(38, 'Evelyn White', '001201001023', '123-456-8112', '2', 'infant', '2023-08-11', 'booked', 'Bassinet seat'),
(38, 'Harper Black', '001201001024', '123-456-8113', '1', 'adult', '2023-08-12', 'confirmed', 'Window seat'),
(38, 'Elijah Blue', '001201001025', '123-456-8114', '2', 'child', '2023-08-13', 'booked', 'Aisle seat'),
(38, 'Aria Red', '001201001026', '123-456-8115', '1', 'adult', '2023-08-14', 'confirmed', 'Window seat'),
(38, 'Benjamin Green', '001201001027', '123-456-8116', '2', 'child', '2023-08-15', 'cancelled', 'Aisle seat'),
(38, 'Eleanor White', '001201001028', '123-456-8117', '1', 'adult', '2023-08-16', 'booked', 'Extra legroom'),
(39, 'Aubrey Black', '001201001029', '123-456-8118', '2', 'infant', '2023-08-17', 'booked', 'Bassinet seat'),
(39, 'William Blue', '001201001030', '123-456-8119', '1', 'adult', '2023-08-18', 'confirmed', 'Window seat'),
(39, 'Charlotte Red', '001201001031', '123-456-8120', '2', 'child', '2023-08-19', 'booked', 'Aisle seat'),
(39, 'Henry Green', '001201001032', '123-456-8121', '1', 'adult', '2023-08-20', 'confirmed', 'Window seat'),
(39, 'Victoria White', '001201001033', '123-456-8122', '2', 'child', '2023-08-21', 'cancelled', 'Aisle seat'),
(39, 'Thomas Black', '001201001034', '123-456-8123', '1', 'adult', '2023-08-22', 'booked', 'Extra legroom'),
(40, 'Nora Blue', '001201001035', '123-456-8124', '2', 'infant', '2023-08-23', 'booked', 'Bassinet seat'),
(40, 'Oliver Red', '001201001036', '123-456-8125', '1', 'adult', '2023-08-24', 'confirmed', 'Window seat'),
(40, 'Liam Green', '001201001037', '123-456-8126', '2', 'child', '2023-08-25', 'booked', 'Aisle seat'),
(40, 'Emma White', '001201001038', '123-456-8127', '1', 'adult', '2023-08-26', 'confirmed', 'Window seat'),
(40, 'James Black', '001201001039', '123-456-8128', '2', 'child', '2023-08-27', 'cancelled', 'Aisle seat'),
(40, 'Grace Blue', '001201001040', '123-456-8129', '1', 'adult', '2023-08-28', 'booked', 'Extra legroom'),
(40, 'Amelia Red', '001201001041', '123-456-8130', '2', 'infant', '2023-08-29', 'booked', 'Bassinet seat'),
(40, 'Lucas Green', '001201001042', '123-456-8131', '1', 'adult', '2023-08-30', 'confirmed', 'Window seat'),
(40, 'Alexander White', '001201001043', '123-456-8132', '2', 'child', '2023-08-31', 'booked', 'Aisle seat'),
(40, 'Emily Black', '001201001044', '123-456-8133', '1', 'adult', '2023-09-01', 'confirmed', 'Window seat'),
(40, 'Daniel Blue', '001201001045', '123-456-8134', '2', 'child', '2023-09-02', 'cancelled', 'Aisle seat');
