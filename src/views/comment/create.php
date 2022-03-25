<?php
list('data' => $data, 'code' => $code) = get_defined_vars();
echo json($data, $code);