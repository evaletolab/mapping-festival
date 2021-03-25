<?php

  //
  // naive security
  function controller_artist_security_post($token, $method) {
  }

  //
  // naive validation
  function controller_artist_validate($data){
    if(!property_exists($data, 'slug')){
        return False;
    }
    if(!property_exists($data, 'content')){
        return False;
    }
    if(!property_exists($data, 'version')){
        return False;
    }
    if(!property_exists($data, 'published')){
      return False;
    }
    if(!property_exists($data, 'time')){
      return False;
    }
    return True;
  }

  //
  // GET /editor?published=true&lang=fr
  function controller_artist_all($db,$query) {
    $published = $query["published"] == "true" ? 1:0;

    $results = $db->findAll();
    // $results = $db->createQueryBuilder()->where(["published" , "=" , $published])->getQuery()->fetch();


    if(!$results){
        http_response_code(500);
        exit();
    }

    
    // free the memory, this in NOT done automatically, while your script is running
    http_response_code(200);
    echo json_encode($results);
  }

  //
  // GET /editor/slug?published=true&lang=fr
  function controller_artist_get($db,$id,$query) {
    $query = $query ?? array();
    $published = $query["published"] == "true" ? 1:0;

    $result = $db->findById($id);
    if(!$result){
      http_response_code(500);
      exit();
    }

    http_response_code(200);
    echo json_encode($result);
  }

  //
  // POST /editor $payload
  function controller_artist_add($db, $artist) {
    if(!controller_artist_validate($artist)){
      //response_fail();
    }
    $array = json_decode(json_encode($artist), true);

    $result = $db->insert($array);

    if(!$result){
        http_response_code(500);
        exit();
    }
    
    // free the memory, this in NOT done automatically, while your script is running
    http_response_code(200);
    echo json_encode($result);
  }


  //
  // PUT /editor $payload
  function controller_artist_update($db, $slug, $artist) {
    if(!controller_artist_validate($artist)){
      //response_fail();
    }

    $array = json_decode(json_encode($artist), true);
    $result = $db->updateById($slug, $array);
    if(!$result){
        http_response_code(500);
        exit();
    }
    
    http_response_code(200);
    echo json_encode($result);
  }  
  //
  // url form /param/param ?query body
  function controller_artist($db, $method, $params, $query, $body) {
    response_to_console($method,'event');
    switch ($method) {
      case 'GET':
        if($params[2]) {
          controller_artist_get($db, $params[2],$query);
        } else {
          controller_artist_all($db,$query);
        }
        break;
      case 'POST':
        controller_artist_add($db, $body);
        break;
      case 'PUT':
        controller_artist_update($db,$params[2], $body);
        break;
      case 'DELETE':
        break;
      default:
      http_response_code(400);
      break;
    }
  }
?>