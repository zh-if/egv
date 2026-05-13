<?php
/*
 * @ https://EasyToYou.eu - IonCube v14 Decoder Online
 * @ PHP 7.4
 * @ Decoder version: 1.0.2
 * @ Release: 10/08/2022
 */

// Decoded file for php version 74.
require_once "/opt/unetlab/html/includes/init.php";
require_once BASE_DIR . "/html/includes/Slim/Slim.php";
require_once BASE_DIR . "/html/includes/Slim-Extras/DateTimeFileWriter.php";
require_once BASE_DIR . "/html/includes/api_authentication.php";
require_once BASE_DIR . "/html/includes/api_configs.php";
require_once BASE_DIR . "/html/includes/api_folders.php";
require_once BASE_DIR . "/html/includes/api_labs.php";
require_once BASE_DIR . "/html/includes/api_tasks.php";
require_once BASE_DIR . "/html/includes/api_networks.php";
require_once BASE_DIR . "/html/includes/api_nodes.php";
require_once BASE_DIR . "/html/includes/api_pictures.php";
require_once BASE_DIR . "/html/includes/api_status.php";
require_once BASE_DIR . "/html/includes/api_textobjects.php";
require_once BASE_DIR . "/html/includes/api_lineobjects.php";
require_once BASE_DIR . "/html/includes/api_topology.php";
require_once BASE_DIR . "/html/includes/api_uusers.php";
require_once BASE_DIR . "/html/includes/api_capture.php";
require_once BASE_DIR . "/html/includes/api_html5Desktop.php";
require_once BASE_DIR . "/html/includes/api_cluster.php";
Slim\Slim::registerAutoloader();
$app = new Slim\Slim(["mode" => "production", "debug" => true, "log.level" => Slim\Log::WARN, "log.enabled" => true, "log.writer" => new Slim\LogWriter(fopen("/opt/unetlab/data/Logs/api.txt", "a"))]);
$app->hook("slim.after.router", function () use ($app) {
    $request = $app->request;
    $response = $app->response;
    $app->log->debug("Request path: " . $request->getPathInfo());
    $app->log->debug("Response status: " . $response->getStatus());
});
$app->response->headers->set("Content-Type", "application/json");
$app->response->headers->set("X-Powered-By", "Unified Networking Lab API");
$app->response->headers->set("Cache-Control", "no-store, no-cache, must-revalidate, max-age=0");
$app->response->headers->set("Cache-Control", "post-check=0, pre-check=0");
$app->response->headers->set("Pragma", "no-cache");
$app->notFound(function () use ($app) {
    $output["code"] = 404;
    $output["status"] = "fail";
    $output["message"] = $GLOBALS["messages"][60038];
    $app->halt($output["code"], json_encode($output));
});
class ResourceNotFoundException extends Exception
{
}
class AuthenticateFailedException extends Exception
{
}
$db = checkDatabase();
if ($db === false) {
    $app->map("/api/(:path+)", function () use ($app) {
        $output["code"] = 500;
        $output["status"] = "fail";
        $output["message"] = $GLOBALS["messages"][90003];
        $app->response->setStatus($output["code"]);
        $app->response->setBody(json_encode($output));
    })->via("DELETE", "GET", "POST");
    $app->run();
}
$html5_db = html5_checkDatabase();
if ($html5_db === false) {
    $app->map("/api/(:path+)", function () use ($app) {
        $output["code"] = 500;
        $output["status"] = "fail";
        $output["message"] = $GLOBALS["messages"][90003];
        $app->response->setStatus($output["code"]);
        $app->response->setBody(json_encode($output));
    })->via("DELETE", "GET", "POST");
    $app->run();
}
if (!updateDatabase($db)) {
    $app->map("/api/(:path+)", function () use ($app) {
        $output["code"] = 500;
        $output["status"] = "fail";
        $output["message"] = $GLOBALS["messages"][90006];
        $app->response->setStatus($output["code"]);
        $app->response->setBody(json_encode($output));
    })->via("DELETE", "GET", "POST");
    $app->run();
}
$forbidden = ["code" => 401, "status" => "forbidden", "message" => $GLOBALS["messages"][90032]];
$app->post("/api/auth/login", function () use ($app, $db, $html5_db) {
    $event = json_decode($app->request()->getBody());
    $p = json_decode(json_encode($event), true);
    $cookie = genUuid();
    $output = apiLogin($db, $html5_db, $p, $cookie);
    $mycookie = $cookie;
    if ($output["code"] == 200) {
        $app->setCookie("unetlab_session", $cookie, 0, "/api/", $_SERVER["SERVER_NAME"], true, true);
    }
    $app->response->setStatus($output["code"]);
    $app->response->setBody(json_encode($output));
    if ($output["code"] == 200) {
        list($user, $tenant, $noneed) = apiAuthorization($db, $mycookie);
        if (!$user) {
            $output["code"] = 400;
            $output["data"]["reason"] = "Unauthorized";
            $app->response->setStatus($output["code"]);
            $app->response->setBody(json_encode($output));
            return NULL;
        }
    }
    $db = NULL;
    $html5_db = NULL;
});
$app->get("/api/auth/logout", function () use ($app, $db) {
    $cookie = $app->getCookie("unetlab_session");
    $app->deleteCookie("unetlab_session");
    $output = apiLogout($db, $cookie);
    $app->response->setStatus($output["code"]);
    $app->response->setBody(json_encode($output));
    $db = NULL;
    $html5_db = NULL;
});
$app->get("/api/auth", function () use ($app, $db) {
    list($user, $tenant, $output) = apiAuthorization($db, $app->getCookie("unetlab_session"));
    if ($user === false) {
        $output["code"] = 401;
        $app->response->setStatus($output["code"]);
        $app->response->setBody(json_encode($output));
    } else {
        if (checkFolder(BASE_LAB . $user["folder"]) !== 0) {
            $user["folder"] = "/";
        }
        $output["code"] = 200;
        $output["status"] = "success";
        $output["message"] = $GLOBALS["messages"][90002];
        $output["data"] = $user;
        $output["eve_uid"] = get_eve_uid();
        $app->response->setStatus($output["code"]);
        $app->response->setBody(json_encode($output));
        $db = NULL;
        $html5_db = NULL;
    }
});
$app->get("/api/actions_js", function () use ($app) {
    $app->response->headers->set("Content-Type", "text/javascript");
    actions_js();
});
$app->get("/api/functions_js", function () use ($app) {
    $app->response->headers->set("Content-Type", "text/javascript");
    functions_js();
});
$app->get("/api/status", function () use ($app, $db) {
    list($user, $tenant, $output) = apiAuthorization($db, $app->getCookie("unetlab_session"));
    if ($user === false) {
        $app->response->setStatus($output["code"]);
        $app->response->setBody(json_encode($output));
    } else {
        $output["code"] = 200;
        $output["status"] = "success";
        $output["message"] = $GLOBALS["messages"][60001];
        $output["data"] = [];
        $output["data"]["version"] = VERSION;
        $cmd = "/opt/qemu/bin/qemu-system-x86_64 -version | sed 's/.* \\([0-9]*\\.[0-9.]*\\.[0-9.]*\\).*/\\1/g'";
        exec($cmd, $o, $rc);
        if ($rc != 0) {
            error_log(date("M d H:i:s ") . "ERROR: " . $GLOBALS["messages"][60044]);
            $output["data"]["qemu_version"] = "";
        } else {
            $output["data"]["qemu_version"] = $o[0];
        }
        $o = "";
        $cmd = "cat /sys/kernel/mm/uksm/run";
        exec($cmd, $o, $rc);
        if ($rc != 0) {
            $output["data"]["uksm"] = "unsupported";
        } else if ($o[0] == "1") {
            $output["data"]["uksm"] = "enabled";
        } else {
            $output["data"]["uksm"] = "disabled";
        }
        $o = "";
        $cmd = "cat /sys/kernel/mm/ksm/run";
        exec($cmd, $o, $rc);
        if ($rc != 0) {
            $output["data"]["ksm"] = "unsupported";
        } else if ($o[0] == "1") {
            $output["data"]["ksm"] = "enabled";
        } else {
            $output["data"]["ksm"] = "disabled";
        }
        $o = "";
        $cmd = "systemctl is-active cpulimit.service";
        exec($cmd, $o, $rc);
        if ($rc != 0) {
            error_log(date("M d H:i:s ") . "ERROR: " . $GLOBALS["messages"][60044]);
            $output["data"]["cpulimit"] = "disabled";
        } else if ($o[0] == "active") {
            $output["data"]["cpulimit"] = "enabled";
        } else {
            $output["data"]["cpulimit"] = "disabled";
        }
        $output["data"]["cpu"] = apiGetCPUUsage();
        $output["data"]["vCPU"] = apiGetvCPU();
        $output["data"]["disk"] = apiGetDiskUsage();
        $output["data"]["diskavailable"] = apiGetDiskAvailable();
        $output["data"]["mindisk"] = MINDISK;
        $output["data"]["memtotal"] = apiGetTotalMem();
        list($output["data"]["cached"], $output["data"]["mem"]) = apiGetMemUsage();
        $output["data"]["swap"] = apiGetSwapUsage();
        $output["data"]["swapavailable"] = apiGetSwap();
        list($output["data"]["iol"], $output["data"]["dynamips"], $output["data"]["qemu"], $output["data"]["docker"], $output["data"]["vpcs"]) = apiGetRunningWrappers();
        $app->response->setStatus($output["code"]);
        $app->response->setBody(json_encode($output));
        $db = NULL;
        $html5_db = NULL;
    }
});
$app->get("/api/print", function () use ($app, $db) {
    list($user, $tenant, $output) = apiAuthorization($db, $app->getCookie("unetlab_session"));
    if ($user === false) {
        $app->response->setStatus($output["code"]);
        $app->response->setBody(json_encode($output));
    } else {
        $output["code"] = 200;
        $output["status"] = "success";
        $output["message"] = $GLOBALS["messages"][60001];
        $cookie = $app->getCookie("unetlab_session");
        $cmd = "cd /opt/unetlab/screenshot/ ; ./print_topology " . $cookie;
        error_log(date("M d H:i:s ") . "DEBUG: print - run " . $cmd);
        $o = "";
        exec($cmd, $o, $rc);
        if ($rc != 0) {
            $output["code"] = 401;
            $output["status"] = "failed";
        } else {
            $output["print"] = $o[0];
        }
        $app->response->setStatus($output["code"]);
        $app->response->setBody(json_encode($output));
    }
});
$app->get("/api/runningnodes", function () use ($app, $db) {
    list($user, $tenant, $output) = apiAuthorization($db, $app->getCookie("unetlab_session"));
    if ($user === false) {
        $app->response->setStatus($output["code"]);
        $app->response->setBody(json_encode($output));
    } else {
        $labuser = $user["labuser"] == NULL ? $user["username"] : $user["labuser"];
        $labviewer = $tenant != $user["tenant"] ? $user["tenant"] : $tenant;
        $output = apiGetRunningNodes($db, $user["role"], $tenant, $user["html5"], $labviewer);
        $app->response->setStatus($output["code"]);
        $app->response->setBody(json_encode($output));
        $db = NULL;
        $html5_db = NULL;
    }
});
$app->get("/api/runninglabs", function () use ($app, $db) {
    list($user, $tenant, $output) = apiAuthorization($db, $app->getCookie("unetlab_session"));
    if ($user === false) {
        $app->response->setStatus($output["code"]);
        $app->response->setBody(json_encode($output));
    } else {
        $output = apiGetRunningLabs($db, $user["role"], $tenant, $user["html5"]);
        $app->response->setStatus($output["code"]);
        $app->response->setBody(json_encode($output));
        $db = NULL;
        $html5_db = NULL;
    }
});
$app->get("/api/system/settings", function () use ($app, $db) {
    list($user, $tenant, $output) = apiAuthorization($db, $app->getCookie("unetlab_session"));
    if (!$user["role"][["admin" => true]]) {
        $app->response->setStatus($GLOBALS["forbidden"]["code"]);
        $app->response->setBody(json_encode($GLOBALS["forbidden"]));
    } else {
        $output = apiGetSystemSettings();
        $app->response->setStatus($output["code"]);
        $app->response->setBody(json_encode($output));
    }
});
$app->get("/api/poll", function () use ($app, $db) {
    list($user, $tenant, $output) = apiAuthorization($db, $app->getCookie("unetlab_session"));
    if ($user === false) {
        $app->response->setStatus($output["code"]);
        $app->response->setBody(json_encode($output));
    } else {
        $output["data"]["diskavailable"] = apiGetDiskAvailable(0);
        $output["data"]["disk"] = apiGetDiskUsed(0);
        $output["data"]["mindisk"] = MINDISK;
        $output["code"] = 200;
        $output["status"] = "success";
        $app->response->setStatus($output["code"]);
        $app->response->setBody(json_encode($output));
    }
});
$app->delete("/api/status", function () use ($app, $db) {
    list($user, $tenant, $output) = apiAuthorization($db, $app->getCookie("unetlab_session"));
    if ($user === false) {
        $app->response->setStatus($output["code"]);
        $app->response->setBody(json_encode($output));
    } else if (!$user["role"][["admin" => true]]) {
        $app->response->setStatus($GLOBALS["forbidden"]["code"]);
        $app->response->setBody(json_encode($GLOBALS["forbidden"]));
    } else {
        $cmd = "sudo /opt/unetlab/wrappers/unl_wrapper -a stopall";
        exec($cmd, $o, $rc);
        if ($rc != 0) {
            error_log(date("M d H:i:s ") . "ERROR: " . $GLOBALS["messages"][60044]);
            $output["code"] = 400;
            $output["status"] = "fail";
            $output["message"] = $GLOBALS["messages"][60050];
        } else {
            $output["code"] = 200;
            $output["status"] = "success";
            $output["message"] = $GLOBALS["messages"][60051];
        }
        $app->response->setStatus($output["code"]);
        $app->response->setBody(json_encode($output));
        $db = NULL;
        $html5_db = NULL;
    }
});
$app->get("/api/list/templates/(:template)", function ($template = "") use ($app, $db) {
    list($user, $tenant, $output) = apiAuthorization($db, $app->getCookie("unetlab_session"));
    if ($user === false) {
        $app->response->setStatus($output["code"]);
        $app->response->setBody(json_encode($output));
    } else {
        if (!isset($template) || $template == "") {
            $output["code"] = 200;
            $output["status"] = "success";
            $output["message"] = $GLOBALS["messages"][60003];
            $output["data"] = $GLOBALS["node_templates"];
        } else if (isset($GLOBALS["node_templates"][$template]) && is_file(BASE_DIR . "/html/" . TPL_DIR . "/" . $template . ".yml")) {
            $p = yaml_parse_file(BASE_DIR . "/html/" . TPL_DIR . "/" . $template . ".yml");
            $p["template"] = $template;
            $output = apiGetLabNodeTemplate($p);
        } else {
            $output["code"] = 404;
            $output["status"] = "fail";
            $output["message"] = $GLOBALS["messages"][60031];
        }
        $app->response->setStatus($output["code"]);
        $app->response->setBody(json_encode($output));
        $db = NULL;
        $html5_db = NULL;
    }
});
$app->get("/api/templates", function () use ($app, $db) {
    list($user, $tenant, $output) = apiAuthorization($db, $app->getCookie("unetlab_session"));
    if ($user === false) {
        $app->response->setStatus($output["code"]);
        $app->response->setBody(json_encode($output));
    } else {
        $output["code"] = 200;
        $output["status"] = "success";
        $output["message"] = $GLOBALS["messages"][60003];
        foreach ($GLOBALS["node_templates"] as $template_name) {
            $output["data"][$template_name] = apiGetLabNodeTemplate($template_name);
        }
        $app->response->setStatus($output["code"]);
        $app->response->setBody(json_encode($output));
        $db = NULL;
        $html5_db = NULL;
    }
});
$app->get("/api/list/networks", function () use ($app, $db) {
    list($user, $tenant, $output) = apiAuthorization($db, $app->getCookie("unetlab_session"));
    if ($user === false) {
        $app->response->setStatus($output["code"]);
        $app->response->setBody(json_encode($output));
    } else {
        $output["code"] = 200;
        $output["status"] = "success";
        $output["message"] = $GLOBALS["messages"][60002];
        $output["data"] = listNetworkTypes();
        $output["icons"] = listNetworkIcons();
        if ($user["role"][["admin" => true]]) {
            $output["nat_only"] = 0;
        } else {
            $output["nat_only"] = NAT_ONLY;
        }
        $app->response->setStatus($output["code"]);
        $app->response->setBody(json_encode($output));
        $db = NULL;
        $html5_db = NULL;
    }
});
$app->get("/api/list/networkicons", function () use ($app, $db) {
    list($user, $tenant, $output) = apiAuthorization($db, $app->getCookie("unetlab_session"));
    if ($user === false) {
        $app->response->setStatus($output["code"]);
        $app->response->setBody(json_encode($output));
    } else {
        $output["code"] = 200;
        $output["status"] = "success";
        $output["message"] = $GLOBALS["messages"][60002];
        $output["data"] = listNetworkIcons();
        $app->response->setStatus($output["code"]);
        $app->response->setBody(json_encode($output));
        $db = NULL;
        $html5_db = NULL;
    }
});
$app->get("/api/list/roles", function () use ($app, $db) {
    list($user, $tenant, $output) = apiAuthorization($db, $app->getCookie("unetlab_session"));
    if ($user === false) {
        $app->response->setStatus($output["code"]);
        $app->response->setBody(json_encode($output));
    } else {
        $output["code"] = 200;
        $output["status"] = "success";
        $output["message"] = $GLOBALS["messages"][60041];
        $output["data"] = listRoles();
        $app->response->setStatus($output["code"]);
        $app->response->setBody(json_encode($output));
        $db = NULL;
        $html5_db = NULL;
    }
});
$app->get("/api/folders/(:path+)", function ($path = []) use ($app, $db) {
    list($user, $tenant, $output) = apiAuthorization($db, $app->getCookie("unetlab_session"), -1);
    if ($user === false) {
        $app->response->setStatus($output["code"]);
        $app->response->setBody(json_encode($output));
    } else {
        $s = preg_replace("/\\.\\.*/", ".", rawurldecode("/" . implode("/", $path)));
        $output = apiGetFolders($s, $tenant);
        if ($output["status"] === "success") {
            $rc = updateUserFolder($db, $app->getCookie("unetlab_session"), $s);
            $app->setCookie("current_path", $s, 0, "/api/", $_SERVER["SERVER_NAME"], false, false);
            if ($rc !== 0) {
                $output["code"] = 500;
                $output["status"] = "error";
                $output["message"] = $GLOBALS["messages"][$rc];
            }
        }
        $app->response->setStatus($output["code"]);
        $app->response->setBody(json_encode($output));
        $db = NULL;
        $html5_db = NULL;
    }
});
$app->put("/api/folders/(:path+)", function ($path = []) use ($app, $db) {
    list($user, $tenant, $output) = apiAuthorization($db, $app->getCookie("unetlab_session"));
    if ($user === false) {
        $app->response->setStatus($output["code"]);
        $app->response->setBody(json_encode($output));
    } else if (!$user["role"][["admin" => true, "editor" => true]]) {
        $app->response->setStatus($GLOBALS["forbidden"]["code"]);
        $app->response->setBody(json_encode($GLOBALS["forbidden"]));
    } else {
        $event = json_decode($app->request()->getBody());
        $s = preg_replace("/\\.\\.*/", ".", rawurldecode("/" . implode("/", $path)));
        $p = json_decode(json_encode($event), true);
        $output = apiEditFolder($s, $p["path"]);
        $app->response->setStatus($output["code"]);
        $app->response->setBody(json_encode($output));
        $db = NULL;
        $html5_db = NULL;
    }
});
$app->post("/api/folders", function () use ($app, $db) {
    list($user, $tenant, $output) = apiAuthorization($db, $app->getCookie("unetlab_session"));
    if ($user === false) {
        $app->response->setStatus($output["code"]);
        $app->response->setBody(json_encode($output));
    } else if (!$user["role"][["admin" => true, "editor" => true]]) {
        $app->response->setStatus($GLOBALS["forbidden"]["code"]);
        $app->response->setBody(json_encode($GLOBALS["forbidden"]));
    } else {
        $event = json_decode($app->request()->getBody());
        $p = json_decode(json_encode($event), true);
        $output = apiAddFolder($p["name"], $p["path"]);
        $app->response->setStatus($output["code"]);
        $app->response->setBody(json_encode($output));
        $db = NULL;
        $html5_db = NULL;
    }
});
$app->delete("/api/folders/(:path+)", function ($path = []) use ($app, $db) {
    list($user, $tenant, $output) = apiAuthorization($db, $app->getCookie("unetlab_session"));
    if ($user === false) {
        $app->response->setStatus($output["code"]);
        $app->response->setBody(json_encode($output));
    } else if (!$user["role"][["admin" => true, "editor" => true]]) {
        $app->response->setStatus($GLOBALS["forbidden"]["code"]);
        $app->response->setBody(json_encode($GLOBALS["forbidden"]));
    } else {
        $s = preg_replace("/\\.\\.*/", ".", rawurldecode("/" . implode("/", $path)));
        error_log(date("M d H:i:s ") . "LOG: Delete : " . $s);
        if ($s == "/Shared" || $s == "/Users") {
            $app->response->setStatus($GLOBALS["forbidden"]["code"]);
            $app->response->setBody(json_encode($GLOBALS["forbidden"]));
        } else {
            $output = apiDeleteFolder($s);
            $app->response->setStatus($output["code"]);
            $app->response->setBody(json_encode($output));
            $db = NULL;
            $html5_db = NULL;
        }
    }
});
$app->get("/api/kill/(:path+)", function ($path = []) use ($app, $db) {
    list($user, $tenant, $output) = apiAuthorization($db, $app->getCookie("unetlab_session"));
    if ($user === false) {
        $app->response->setStatus($output["code"]);
        $app->response->setBody(json_encode($output));
    } else {
        $s = preg_replace("/\\.\\.*/", ".", rawurldecode("/" . implode("/", $path)));
        $patterns = "/\\/node\\/([0-9]+)\$/";
        $replacements = "\$1";
        $patterns2 = "/\\/lab\\/([0-9]+)\$/";
        $port = preg_replace($patterns, $replacements, $s);
        $labid = preg_replace($patterns2, $replacements, $s);
        if (preg_match("/^\\/node\\/[0-9]+\$/", $s)) {
            $output = apiKillNode($port, $user);
        } else if (preg_match("/^\\/lab\\/[0-9]+\$/", $s)) {
            $output = apiKillLab($labid, $user);
        } else {
            $output["code"] = 400;
            $output["status"] = "fail";
            $output["message"] = $GLOBALS["messages"][60027];
        }
        $app->response->setStatus($output["code"]);
        if (isset($output["encoding"])) {
            $app->response->headers->set("Content-Type", $output["encoding"]);
            $app->response->setBody($output["data"]);
        } else {
            $app->response->setBody(json_encode($output));
        }
        $db = NULL;
        $html5_db = NULL;
    }
});
$app->get("/api/wipe/(:path+)", function ($path = []) use ($app, $db) {
    list($user, $tenant, $output) = apiAuthorization($db, $app->getCookie("unetlab_session"));
    if ($user === false) {
        $app->response->setStatus($output["code"]);
        $app->response->setBody(json_encode($output));
    } else {
        $s = preg_replace("/\\.\\.*/", ".", rawurldecode("/" . implode("/", $path)));
        $patterns[0] = "/^\\/([0-9]+).*/";
        $replacements[0] = "\$1";
        $patterns[1] = "/^\\/[0-9]+\\/([a-z0-9-]+).*/";
        $replacements[1] = "\$1";
        $labtenant = preg_replace($patterns[0], $replacements[0], $s);
        $labuuid = preg_replace($patterns[1], $replacements[1], $s);
        if ($labtenant != $tenant && $user["role"] != "admin") {
            $output["code"] = 400;
            $output["status"] = "fail";
            $output["message"] = $GLOBALS["messages"][60027];
            $app->response->setStatus($output["code"]);
            $app->response->setBody(json_encode($output));
            $db = NULL;
            $html5_db = NULL;
        } else {
            if (preg_match("/^\\/[0-9]+\\/[a-z0-9\\-]+\$/", $s)) {
                $output = apiWipeLab($labtenant, $labuuid);
            } else {
                $output["code"] = 400;
                $output["status"] = "fail";
                $output["message"] = $GLOBALS["messages"][60027];
            }
            $app->response->setStatus($output["code"]);
            if (isset($output["encoding"])) {
                $app->response->headers->set("Content-Type", $output["encoding"]);
                $app->response->setBody($output["data"]);
            } else {
                $app->response->setBody(json_encode($output));
            }
            $db = NULL;
            $html5_db = NULL;
        }
    }
});
$app->get("/api/labs/(:path+)", function ($path = []) use ($app, $db) {
    $s = preg_replace("/\\.\\.*/", ".", rawurldecode("/" . implode("/", $path)));
    if (preg_match("/^\\/[A-Za-z0-9_+\\/\\s\\-@\\.]+\\.unl\\/[0-9]+\$/", $s)) {
        $id = preg_replace("/.+\\/([0-9]+)\\/*.*\$/", "\$1", $s);
        $lab_shared = preg_replace("/(.+).unl.*\$/", "\$1.unl", $s);
        list($user, $tenant, $output) = apiAuthorization($db, $app->getCookie("unetlab_session"), $id, $lab_shared);
    } else {
        list($user, $tenant, $output) = apiAuthorization($db, $app->getCookie("unetlab_session"));
    }
    if ($user === false) {
        $app->response->setStatus($output["code"]);
        $app->response->setBody(json_encode($output));
    } else {
        $patterns[0] = "/(.+).unl.*\$/";
        $replacements[0] = "\$1.unl";
        $patterns[1] = "/.+\\/([0-9]+)\\/*.*\$/";
        $replacements[1] = "\$1";
        $patterns[2] = "/.*\\/stopmode=([0-3]).*\$/";
        $replacements[2] = "\$1";
        $lab_file = preg_replace($patterns[0], $replacements[0], $s);
        $id = preg_replace($patterns[1], $replacements[1], $s);
        $labuser = $user["labuser"] == NULL ? $user["username"] : $user["labuser"];
        $labviewer = $tenant != $user["tenant"] ? $user["tenant"] : $tenant;
        $stopmode = preg_replace($patterns[2], $replacements[2], $s);
        if (!is_file(BASE_LAB . $lab_file)) {
            $output["code"] = 404;
            $output["status"] = "fail";
            $output["message"] = $GLOBALS["messages"][60000];
            $app->response->setStatus($output["code"]);
            $app->response->setBody(json_encode($output));
        } else {
            try {
                $lab = new Lab(BASE_LAB . $lab_file, $tenant);
            } catch (Exception $e) {
                $output["code"] = 400;
                $output["status"] = "fail";
                $output["message"] = $GLOBALS["messages"][60056];
                $output["message"] = $e->getMessage();
                $app->response->setStatus($output["code"]);
                $app->response->setBody(json_encode($output));
                return NULL;
            }
            if (preg_match("/^\\/[A-Za-z0-9_+\\/\\s\\-@\\.]+\\.unl\\/html\$/", $s)) {
                $Parsedown = new Parsedown();
                $output["code"] = 200;
                $output["status"] = "success";
                $output["message"] = $GLOBALS["messages"][60054];
                $output["data"] = $Parsedown->text($lab->getBody());
                $app->response->setStatus($output["code"]);
                $app->response->setBody(json_encode($output));
            } else if (preg_match("/^\\/[A-Za-z0-9_+\\/\\s\\-@\\.]+\\.unl\\/configs\$/", $s)) {
                $output = apiGetLabConfigs($lab);
            } else if (preg_match("/^\\/[A-Za-z0-9_+\\/\\s\\-@\\.]+\\.unl\\/configs\\/[0-9]+\$/", $s)) {
                $output = apiGetLabConfig($lab, $id);
            } else if (preg_match("/^\\/[A-Za-z0-9_+\\/\\s\\-@\\.]+\\.unl\\/configsets\$/", $s)) {
                $output = apiGetLabConfigSets($lab);
            } else if (preg_match("/^\\/[A-Za-z0-9_+\\/\\s\\-@\\.]+\\.unl\\/networks\$/", $s)) {
                $output = apiGetLabNetworks($lab);
            } else if (preg_match("/^\\/[A-Za-z0-9_+\\/\\s\\-@\\.]+\\.unl\\/networks\\/[0-9]+\$/", $s)) {
                $output = apiGetLabNetwork($lab, $id);
            } else if (preg_match("/^\\/[A-Za-z0-9_+\\/\\s\\-@\\.]+\\.unl\\/links\$/", $s)) {
                $output = apiGetLabLinks($lab);
            } else if (preg_match("/^\\/[A-Za-z0-9_+\\/\\s\\-@\\.]+\\.unl\\/nodes\$/", $s)) {
                $output = apiGetLabNodes($lab, $tenant, $user["html5"], $user, $labuser, $labviewer);
            } else if (preg_match("/^\\/[A-Za-z0-9_+\\/\\s\\-@\\.]+\\.unl\\/nodes\\/status\$/", $s)) {
                $output = apiGetLabNodesStatus($lab, $tenant, $user["html5"], $user, $labuser, $labviewer);
                $output["data"]["diskavailable"] = apiGetDiskAvailable(0);
                $output["data"]["disk"] = apiGetDiskUsed(0);
                $output["data"]["mindisk"] = MINDISK;
            } else if (preg_match("/^\\/[A-Za-z0-9_+\\/\\s\\-@\\.]+\\.unl\\/nodes\\/stop\$/", $s)) {
                if ($tenant < 0) {
                    $output["code"] = 400;
                    $output["status"] = "fail";
                    $output["message"] = $GLOBALS["messages"][60052];
                    $app->response->setStatus($output["code"]);
                    $app->response->setBody(json_encode($output));
                    return NULL;
                }
                $output = apiStopLabNodes($lab, $tenant);
            } else if (preg_match("/^\\/[A-Za-z0-9_+\\/\\s\\-@\\.]+\\.unl\\/nodes\\/wipe\$/", $s)) {
                if ($tenant < 0) {
                    $output["code"] = 400;
                    $output["status"] = "fail";
                    $output["message"] = $GLOBALS["messages"][60052];
                    $app->response->setStatus($output["code"]);
                    $app->response->setBody(json_encode($output));
                    return NULL;
                }
                $output = apiWipeLabNodes($lab, $tenant, $user);
            } else if (preg_match("/^\\/[A-Za-z0-9_+\\/\\s\\-@\\.]+\\.unl\\/nodes\\/[0-9]+\$/", $s)) {
                $output = apiGetLabNode($lab, $id, $user["html5"], $user, $user["username"], $labviewer);
            } else if (preg_match("/^\\/[A-Za-z0-9_+\\/\\s\\-@\\.]+\\.unl\\/nodes\\/[0-9]+\\/interfaces\$/", $s)) {
                $output = apiGetLabNodeInterfaces($lab, $id);
            } else if (preg_match("/^\\/[A-Za-z0-9_+\\/\\s\\-@\\.]+\\.unl\\/interfaces\$/", $s)) {
                $output = apiGetLabNodesInterfaces($lab, $id);
            } else if (preg_match("/^\\/[A-Za-z0-9_+\\/\\s\\-@\\.]+\\.unl\\/nodes\\/[0-9]+\\/start\$/", $s)) {
                if ($tenant < 0) {
                    $output["code"] = 400;
                    $output["status"] = "fail";
                    $output["message"] = $GLOBALS["messages"][60052];
                    $app->response->setStatus($output["code"]);
                    $app->response->setBody(json_encode($output));
                    return NULL;
                }
                $output = apiStartLabNode($lab, $id, $tenant, $user);
            } else if (preg_match("/^\\/[A-Za-z0-9_+\\/\\s\\-@\\.]+\\.unl\\/nodes\\/[0-9]+\\/stop\\/stopmode=[0-3]/", $s)) {
                if ($tenant < 0) {
                    $output["code"] = 400;
                    $output["status"] = "fail";
                    $output["message"] = $GLOBALS["messages"][60052];
                    $app->response->setStatus($output["code"]);
                    $app->response->setBody(json_encode($output));
                    return NULL;
                }
                $output = apiStopLabNode($lab, $id, $tenant, $stopmode);
            } else if (preg_match("/^\\/[A-Za-z0-9_+\\/\\s\\-@\\.]+\\.unl\\/nodes\\/[0-9]+\\/wipe\$/", $s)) {
                if ($tenant < 0) {
                    $output["code"] = 400;
                    $output["status"] = "fail";
                    $output["message"] = $GLOBALS["messages"][60052];
                    $app->response->setStatus($output["code"]);
                    $app->response->setBody(json_encode($output));
                    return NULL;
                }
                $output = apiWipeLabNode($lab, $id, $tenant);
            } else if (preg_match("/^\\/[A-Za-z0-9_+\\/\\s\\-@\\.]+\\.unl\\/topology\$/", $s)) {
                if ($tenant < 0) {
                    $output["code"] = 400;
                    $output["status"] = "fail";
                    $output["message"] = $GLOBALS["messages"][60052];
                    $app->response->setStatus($output["code"]);
                    $app->response->setBody(json_encode($output));
                    return NULL;
                }
                if ((int) $user["sticky"] != 1) {
                    $rc = updatePodLab($db, $user["tenant"], $lab_file);
                } else {
                    $rc = 0;
                }
                if ($rc !== 0) {
                    $output["code"] = 500;
                    $output["status"] = "error";
                    $output["message"] = $GLOBALS["messages"][$rc];
                } else {
                    $output = apiGetLabTopology($lab);
                }
            } else if (preg_match("/^\\/[A-Za-z0-9_+\\/\\s\\-@\\.]+\\.unl\\/topology\\/[0-9]+\$/", $s)) {
                error_log(date("M d H:i:s ") . "LOG: spy pod  : " . $id);
                apiSpy($db, $user["tenant"], $id);
                $rc = updatePodLab($db, $user["tenant"], $lab_file);
                if ($rc !== 0) {
                    $output["code"] = 500;
                    $output["status"] = "error";
                    $output["message"] = $GLOBALS["messages"][$rc];
                } else {
                    $output = apiGetLabTopology($lab);
                }
            } else if (preg_match("/^\\/[A-Za-z0-9_+\\/\\s\\-@\\.]+\\.unl\\/textobjects\$/", $s)) {
                $output = apiGetLabTextObjects($lab, $id);
            } else if (preg_match("/^\\/[A-Za-z0-9_+\\/\\s\\-@\\.]+\\.unl\\/tasks\$/", $s)) {
                $output = apiGetLabTasks($lab, $id);
            } else if (preg_match("/^\\/[A-Za-z0-9_+\\/\\s\\-@\\.]+\\.unl\\/textobjects\\/[0-9]+\$/", $s)) {
                $output = apiGetLabTextObject($lab, $id);
            } else if (preg_match("/^\\/[A-Za-z0-9_+\\/\\s\\-@\\.]+\\.unl\\/task\\/[0-9]+\$/", $s)) {
                $output = apiGetLabTask($lab, $id);
            } else if (preg_match("/^\\/[A-Za-z0-9_+\\/\\s\\-@\\.]+\\.unl\\/lineobjects\$/", $s)) {
                $output = apiGetLabLineObjects($lab, $id);
            } else if (preg_match("/^\\/[A-Za-z0-9_+\\/\\s\\-@\\.]+\\.unl\\/lineobjects\\/[0-9]+\$/", $s)) {
                $output = apiGetLabLineObject($lab, $id);
            } else if (preg_match("/^\\/[A-Za-z0-9_+\\/\\s\\-@\\.]+\\.unl\\/pictures\$/", $s)) {
                $output = apiGetLabPictures($lab, $id);
            } else if (preg_match("/^\\/[A-Za-z0-9_+\\/\\s\\-@\\.]+\\.unl\\/pictures\\/[0-9]+\$/", $s)) {
                $output = apiGetLabPicture($lab, $id);
            } else if (preg_match("/^\\/[A-Za-z0-9_+\\/\\s\\-@\\.]+\\.unl\\/picturesmapped\\/[0-9]+\$/", $s)) {
                $output = apiGetLabPictureMapped($lab, $id, $user["html5"], $user["username"]);
            } else if (preg_match("/^\\/[A-Za-z0-9_+\\/\\s\\-@\\.]+\\.unl\\/pictures\\/[0-9]+\\/data\$/", $s)) {
                $height = 0;
                $width = 0;
                if (0 < $app->request()->params("width")) {
                    $width = $app->request()->params("width");
                }
                if ($app->request()->params("height")) {
                    $height = $app->request()->params("height");
                }
                $output = apiGetLabPictureData($lab, $id, $width, $height);
            } else if (preg_match("/^\\/[A-Za-z0-9_+\\/\\s\\-@\\.]+\\.unl\\/pictures\\/[0-9]+\\/data\\/[0-9]+\\/[0-9]+\$/", $s)) {
                $height = preg_replace("/^\\/[A-Za-z0-9_+\\/\\s\\-@\\.]+\\.unl\\/pictures\\/[0-9]+\\/data\\/\\([0-9]+\\)\\/\\([0-9]+\\)\$/", "\$1", $s);
                $width = preg_replace("/^\\/[A-Za-z0-9_+\\/\\s\\-@\\.]+\\.unl\\/pictures\\/[0-9]+\\/data\\/\\([0-9]+\\)\\/\\([0-9]+\\)\$/", "\$1", $s);
                $output = apiGetLabPictureData($lab, $id, $width, $height);
            } else if (preg_match("/^\\/[A-Za-z0-9_+\\/\\s\\-@\\.]+\\.unl\$/", $s)) {
                $output = apiGetLab($lab, $user);
            } else if (preg_match("/^\\/[A-Za-z0-9_+\\/\\s\\-@\\.]+\\.unl\\/[0-9]+\$/", $s)) {
                $output = apiGetLab($lab, $user);
            } else {
                $output["code"] = 400;
                $output["status"] = "fail";
                $output["message"] = $GLOBALS["messages"][60027];
            }
            $app->response->setStatus($output["code"]);
            if (isset($output["encoding"])) {
                $app->response->headers->set("Content-Type", $output["encoding"]);
                $app->response->setBody($output["data"]);
            } else {
                $app->response->setBody(json_encode($output));
            }
            $db = NULL;
            $html5_db = NULL;
        }
    }
});
$app->put("/api/labs/(:path+)", function ($path = []) use ($app, $db) {
    list($user, $tenant, $output) = apiAuthorization($db, $app->getCookie("unetlab_session"));
    $s = preg_replace("/\\.\\.*/", ".", rawurldecode("/" . implode("/", $path)));
    if ($user === false) {
        $app->response->setStatus($output["code"]);
        $app->response->setBody(json_encode($output));
    } else {
        $permit = 0;
        $nolock = 0;
        if (preg_match("/^\\/[A-Za-z0-9_+\\/\\s\\-@\\.]+\\.unl\\/suspend\$/", $s) || preg_match("/^\\/[A-Za-z0-9_+\\/\\s\\-@\\.]+\\.unl\\/resume\$/", $s) || preg_match("/^\\/[A-Za-z0-9_+\\/\\s\\-@\\.]+\\.unl\\/quality\$/", $s) || preg_match("/^\\/[A-Za-z0-9_+\\/\\s\\-@\\.]+\\.unl\$/", $s)) {
            $permit = 1;
            $nolock = 1;
        }
        if (!$user["role"][["admin" => true, "editor" => true]] && $permit == 0) {
            $app->response->setStatus($GLOBALS["forbidden"]["code"]);
            $app->response->setBody(json_encode($GLOBALS["forbidden"]));
        } else {
            $event = json_decode($app->request()->getBody());
            $p = json_decode(json_encode($event), true);
            $s = preg_replace("/\\.\\.*/", ".", rawurldecode("/" . implode("/", $path)));
            $patterns[0] = "/(.+).unl.*\$/";
            $replacements[0] = "\$1.unl";
            $patterns[1] = "/.+\\/([0-9]+)\\/*.*\$/";
            $replacements[1] = "\$1";
            $lab_file = preg_replace($patterns[0], $replacements[0], $s);
            $id = preg_replace($patterns[1], $replacements[1], $s);
            if (!is_file(BASE_LAB . $lab_file)) {
                $output["code"] = 404;
                $output["status"] = "fail";
                $output["message"] = $GLOBALS["messages"][60000];
                $app->response->setStatus($output["code"]);
                $app->response->setBody(json_encode($output));
            } else if ($nolock == 0 && !lockFile(BASE_LAB . $lab_file)) {
                $output["code"] = 400;
                $output["status"] = "fail";
                $output["message"] = $GLOBALS["messages"][60061];
                $app->response->setStatus($output["code"]);
                $app->response->setBody(json_encode($output));
            } else {
                try {
                    $lab = new Lab(BASE_LAB . $lab_file, $tenant);
                } catch (Exception $e) {
                    $output["code"] = 400;
                    $output["status"] = "fail";
                    $output["message"] = $GLOBALS["messages"][$e->getMessage()];
                    $app->response->setStatus($output["code"]);
                    $app->response->setBody(json_encode($output));
                    unlockFile(BASE_LAB . $lab_file);
                    return NULL;
                }
                if (preg_match("/^\\/[A-Za-z0-9_+\\/\\s\\-@\\.]+\\.unl\\/networks\\/[0-9]+\$/", $s)) {
                    $p["id"] = $id;
                    if (isset($p["count"])) {
                        unset($p["count"]);
                    }
                    $output = apiEditLabNetwork($lab, $p);
                } else if (preg_match("/^\\/[A-Za-z0-9_+\\/\\s\\-@\\.]+\\.unl\\/networks\$/", $s)) {
                    $output = apiEditLabNetworks($lab, $p);
                } else if (preg_match("/^\\/[A-Za-z0-9_+\\/\\s\\-@\\.]+\\.unl\\/configs\\/[0-9]+\$/", $s)) {
                    $p["id"] = $id;
                    $output = apiEditLabConfig($lab, $p);
                } else if (preg_match("/^\\/[A-Za-z0-9_+\\/\\s\\-@\\.]+\\.unl\\/configsets\\/[0-9]+\$/", $s)) {
                    $output = apiEditLabConfigSet($lab, $id, $p);
                } else if (preg_match("/^\\/[A-Za-z0-9_+\\/\\s\\-@\\.]+\\.unl\\/nodes\\/export\$/", $s)) {
                    if (!$user["role"][["admin" => true, "editor" => true]]) {
                        $app->response->setStatus($GLOBALS["forbidden"]["code"]);
                        $app->response->setBody(json_encode($GLOBALS["forbidden"]));
                        return NULL;
                    }
                    if ($tenant < 0) {
                        $output["code"] = 400;
                        $output["status"] = "fail";
                        $output["message"] = $GLOBALS["messages"][60052];
                        $app->response->setStatus($output["code"]);
                        $app->response->setBody(json_encode($output));
                        return NULL;
                    }
                    $output = apiExportLabNodes($lab, $tenant);
                } else if (preg_match("/^\\/[A-Za-z0-9_+\\/\\s\\-@\\.]+\\.unl\\/nodes\\/[0-9]+\$/", $s)) {
                    $p["id"] = $id;
                    $output = apiEditLabNode($lab, $p);
                } else if (preg_match("/^\\/[A-Za-z0-9_+\\/\\s\\-@\\.]+\\.unl\\/nodes\$/", $s)) {
                    $output = apiEditLabNodes($lab, $p);
                } else if (preg_match("/^\\/[A-Za-z0-9_+\\/\\s\\-@\\.]+\\.unl\\/nodes\\/[0-9]+\\/export\$/", $s)) {
                    if ($tenant < 0) {
                        $output["code"] = 400;
                        $output["status"] = "fail";
                        $output["message"] = $GLOBALS["messages"][60052];
                        $app->response->setStatus($output["code"]);
                        $app->response->setBody(json_encode($output));
                        return NULL;
                    }
                    $output = apiExportLabNode($lab, $id, $tenant);
                } else if (preg_match("/^\\/[A-Za-z0-9_+\\/\\s\\-@\\.]+\\.unl\\/nodes\\/[0-9]+\\/interfaces\$/", $s)) {
                    $output = apiEditLabNodeInterfaces($lab, $tenant, $id, $p);
                } else if (preg_match("/^\\/[A-Za-z0-9_+\\/\\s\\-@\\.]+\\.unl\\/nodes\\/[0-9]+\\/style\$/", $s)) {
                    $output = apiEditLabNodeInterfaceStyle($lab, $tenant, $id, $p);
                } else if (preg_match("/^\\/[A-Za-z0-9_+\\/\\s\\-@\\.]+\\.unl\\/quality\$/", $s)) {
                    $output = apiEditLabNodeInterfaceQuality($lab, $tenant, $user, $p);
                } else if (preg_match("/^\\/[A-Za-z0-9_+\\/\\s\\-@\\.]+\\.unl\\/textobjects\\/[0-9]+\$/", $s)) {
                    $p["id"] = $id;
                    $output = apiEditLabTextObject($lab, $p);
                } else if (preg_match("/^\\/[A-Za-z0-9_+\\/\\s\\-@\\.]+\\.unl\\/task\\/[0-9]+\$/", $s)) {
                    $p["id"] = $id;
                    $output = apiEditLabTask($lab, $p);
                } else if (preg_match("/^\\/[A-Za-z0-9_+\\/\\s\\-@\\.]+\\.unl\\/textobjects\$/", $s)) {
                    $output = apiEditLabTextObjects($lab, $p);
                } else if (preg_match("/^\\/[A-Za-z0-9_+\\/\\s\\-@\\.]+\\.unl\\/lineobjects\\/[0-9]+\$/", $s)) {
                    $p["id"] = $id;
                    $output = apiEditLabLineObject($lab, $p);
                } else if (preg_match("/^\\/[A-Za-z0-9_+\\/\\s\\-@\\.]+\\.unl\\/lineobjects\$/", $s)) {
                    $output = apiEditLabLineObjects($lab, $p);
                } else if (preg_match("/^\\/[A-Za-z0-9_+\\/\\s\\-@\\.]+\\.unl\\/pictures\\/[0-9]+\$/", $s)) {
                    $p["id"] = $id;
                    $output = apiEditLabPicture($lab, $p);
                } else if (preg_match("/^\\/[A-Za-z0-9_+\\/\\s\\-@\\.]+\\.unl\$/", $s)) {
                    $output = apiEditLab($lab, $p, $user);
                } else if (preg_match("/^\\/[A-Za-z0-9_+\\/\\s\\-@\\.]+\\.unl\\/suspend\$/", $s)) {
                    $output = apiSuspendLink($lab, $tenant, $p);
                } else if (preg_match("/^\\/[A-Za-z0-9_+\\/\\s\\-@\\.]+\\.unl\\/resume\$/", $s)) {
                    $output = apiResumeLink($lab, $tenant, $p);
                } else if (preg_match("/^\\/[A-Za-z0-9_+\\/\\s\\-@\\.]+\\.unl\\/Lock\$/", $s)) {
                    $output = apiLockLab($lab, $p);
                } else if (preg_match("/^\\/[A-Za-z0-9_+\\/\\s\\-@\\.]+\\.unl\\/Unlock\$/", $s)) {
                    $output = apiUnlockLab($lab, $p);
                } else if (preg_match("/^\\/[A-Za-z0-9_+\\/\\s\\-@\\.]+\\.unl\\/move\$/", $s)) {
                    $output = apiMoveLab($lab, $p["path"]);
                } else {
                    $output["code"] = 400;
                    $output["status"] = "fail";
                    $output["message"] = $GLOBALS["messages"][60027];
                }
                $app->response->setStatus($output["code"]);
                $app->response->setBody(json_encode($output));
                if ($nolock == 0) {
                    unlockFile(BASE_LAB . $lab_file);
                }
                $db = NULL;
                $html5_db = NULL;
            }
        }
    }
});
$app->post("/api/html5Desktop", function () use ($app, $db) {
    list($user, $tenant, $output) = apiAuthorization($db, $app->getCookie("unetlab_session"));
    if ($user === false) {
        $app->response->setStatus($output["code"]);
        $app->response->setBody(json_encode($output));
    } else {
        $event = json_decode($app->request()->getBody());
        $p = json_decode(json_encode($event), true);
        $output = apiAddHtml5Desktop($p, $tenant, $user);
        if ($output["code"] == 200) {
            $output = apiAddHtml5Desktop($p, $tenant, $user);
        }
        $app->response->setStatus($output["code"]);
        $app->response->setBody(json_encode($output));
    }
});
$app->post("/api/system/settings", function () use ($app, $db) {
    list($user, $tenant, $output) = apiAuthorization($db, $app->getCookie("unetlab_session"));
    if ($user === false) {
        $app->response->setStatus($output["code"]);
        $app->response->setBody(json_encode($output));
    } else if ($user["role"] != "admin") {
        $app->response->setStatus($GLOBALS["forbidden"]["code"]);
        $app->response->setBody(json_encode($GLOBALS["forbidden"]));
    } else {
        $event = json_decode($app->request()->getBody());
        $p = json_decode(json_encode($event), true);
        $output = saveSystemSettings($p);
        $app->response->setStatus($output["code"]);
        $app->response->setBody(json_encode($output));
    }
});
$app->post("/api/labs", function () use ($app, $db) {
    list($user, $tenant, $output) = apiAuthorization($db, $app->getCookie("unetlab_session"));
    if ($user === false) {
        $app->response->setStatus($output["code"]);
        $app->response->setBody(json_encode($output));
    } else if (!$user["role"][["admin" => true, "editor" => true]]) {
        $app->response->setStatus($GLOBALS["forbidden"]["code"]);
        $app->response->setBody(json_encode($GLOBALS["forbidden"]));
    } else {
        $event = json_decode($app->request()->getBody());
        $p = json_decode(json_encode($event), true);
        if (isset($p["source"])) {
            $output = apiCloneLab($p, $tenant);
        } else {
            $output = apiAddLab($p, $tenant);
        }
        $app->response->setStatus($output["code"]);
        $app->response->setBody(json_encode($output));
        $db = NULL;
        $html5_db = NULL;
    }
});
$app->post("/api/capture/(:path+)", function ($path = []) use ($app, $db) {
    list($user, $tenant, $output) = apiAuthorization($db, $app->getCookie("unetlab_session"));
    if ($user === false) {
        $app->response->setStatus($output["code"]);
        $app->response->setBody(json_encode($output));
    } else {
        $event = json_decode($app->request()->getBody());
        $p = json_decode(json_encode($event), true);
        $s = preg_replace("/\\.\\.*/", ".", rawurldecode("/" . implode("/", $path)));
        $patterns[0] = "/(.+).unl.*\$/";
        $replacements[0] = "\$1.unl";
        $patterns[1] = "/.+\\/([0-9]+)\\/*.*\$/";
        $replacements[1] = "\$1";
        $lab_file = preg_replace($patterns[0], $replacements[0], $s);
        $id = preg_replace($patterns[1], $replacements[1], $s);
        if (!is_file(BASE_LAB . $lab_file)) {
            $output["code"] = 404;
            $output["status"] = "fail";
            $output["message"] = $GLOBALS["messages"][60000];
            $app->response->setStatus($output["code"]);
            $app->response->setBody(json_encode($output));
        } else {
            try {
                $lab = new Lab(BASE_LAB . $lab_file, $tenant);
            } catch (Exception $e) {
                $output["code"] = 400;
                $output["status"] = "fail";
                $output["message"] = $GLOBALS["messages"][$e->getMessage()];
                $app->response->setStatus($output["code"]);
                $app->response->setBody(json_encode($output));
                unlockFile(BASE_LAB . $lab_file);
                return NULL;
            }
            $output = apiCapture($lab, $p, $tenant, $user);
            $app->response->setStatus($output["code"]);
            $app->response->setBody(json_encode($output));
            $db = NULL;
            $html5_db = NULL;
        }
    }
});
$app->get("/api/graph/(:node)/(:nic)/(:realnic)", function ($node = "", $nic = "", $realnic = "") use ($app, $db) {
    list($user, $tenant, $output) = apiAuthorization($db, $app->getCookie("unetlab_session"));
    if ($user === false) {
        $app->response->setStatus($output["code"]);
        $app->response->setBody(json_encode($output));
    } else {
        $output = createGraph($node, $nic, $realnic);
        $app->response->setStatus(200);
        $app->response->headers->set("Content-Type", "text/html");
        $app->response->setBody($output);
        $db = NULL;
        $html5_db = NULL;
    }
});
$app->post("/api/labs/(:path+)", function ($path = []) use ($app, $db) {
    list($user, $tenant, $output) = apiAuthorization($db, $app->getCookie("unetlab_session"));
    if ($user === false) {
        $app->response->setStatus($output["code"]);
        $app->response->setBody(json_encode($output));
    } else if (!$user["role"][["admin" => true, "editor" => true]]) {
        $app->response->setStatus($GLOBALS["forbidden"]["code"]);
        $app->response->setBody(json_encode($GLOBALS["forbidden"]));
    } else {
        $event = json_decode($app->request()->getBody());
        $p = json_decode(json_encode($event), true);
        $s = preg_replace("/\\.\\.*/", ".", rawurldecode("/" . implode("/", $path)));
        $o = false;
        $patterns[0] = "/(.+).unl.*\$/";
        $replacements[0] = "\$1.unl";
        $patterns[1] = "/.+\\/([0-9]+)\\/*.*\$/";
        $replacements[1] = "\$1";
        $lab_file = preg_replace($patterns[0], $replacements[0], $s);
        $id = preg_replace($patterns[1], $replacements[1], $s);
        if (isset($event->postfix) && $event->postfix) {
            $o = true;
        }
        if (!is_file(BASE_LAB . $lab_file)) {
            $output["code"] = 404;
            $output["status"] = "fail";
            $output["message"] = $GLOBALS["messages"][60000];
            $app->response->setStatus($output["code"]);
            $app->response->setBody(json_encode($output));
        } else if (!lockFile(BASE_LAB . $lab_file)) {
            $output["code"] = 400;
            $output["status"] = "fail";
            $output["message"] = $GLOBALS["messages"][60061];
            $app->response->setStatus($output["code"]);
            $app->response->setBody(json_encode($output));
        } else {
            try {
                $lab = new Lab(BASE_LAB . $lab_file, $tenant);
            } catch (Exception $e) {
                $output["code"] = 400;
                $output["status"] = "fail";
                $output["message"] = $GLOBALS["messages"][$e->getMessage()];
                $app->response->setStatus($output["code"]);
                $app->response->setBody(json_encode($output));
                unlockFile(BASE_LAB . $lab_file);
                return NULL;
            }
            if (preg_match("/^\\/[A-Za-z0-9_+\\/\\s\\-@\\.]+\\.unl\\/networks\$/", $s)) {
                $output = apiAddLabNetwork($lab, $p, $o);
            } else if (preg_match("/^\\/[A-Za-z0-9_+\\/\\s\\-@\\.]+\\.unl\\/nodes\$/", $s)) {
                if (isset($p["count"])) {
                    unset($p["count"]);
                }
                $output = apiAddLabNode($lab, $p, $o);
            } else if (preg_match("/^\\/[A-Za-z0-9_+\\/\\s\\-@\\.]+\\.unl\\/lines\\/[0-9]+\$/", $s)) {
                $output = apiAddLabLineObject($lab, $p);
            } else if (preg_match("/^\\/[A-Za-z0-9_+\\/\\s\\-@\\.]+\\.unl\\/textobjects\$/", $s)) {
                $output = apiAddLabTextObject($lab, $p, $o);
            } else if (preg_match("/^\\/[A-Za-z0-9_+\\/\\s\\-@\\.]+\\.unl\\/task\$/", $s)) {
                $output = apiAddLabTask($lab, $p, $o);
            } else if (preg_match("/^\\/[A-Za-z0-9_+\\/\\s\\-@\\.]+\\.unl\\/configs\$/", $s)) {
                $output = apiGetLabConfigs($lab, $p);
            } else if (preg_match("/^\\/[A-Za-z0-9_+\\/\\s\\-@\\.]+\\.unl\\/configs\\/[0-9]+\$/", $s)) {
                $output = apiGetLabConfig($lab, $id, $p);
            } else if (preg_match("/^\\/[A-Za-z0-9_+\\/\\s\\-@\\.]+\\.unl\\/configsets\$/", $s)) {
                $output = apiAddLabConfigSet($lab, $p);
            } else if (preg_match("/^\\/[A-Za-z0-9_+\\/\\s\\-@\\.]+\\.unl\\/pictures\$/", $s)) {
                $p = $_POST;
                if (!empty($_FILES)) {
                    foreach ($_FILES as $file) {
                        if (file_exists($file["tmp_name"])) {
                            $fp = fopen($file["tmp_name"], "r");
                            $size = filesize($file["tmp_name"]);
                            if ($fp !== false) {
                                $finfo = new finfo(FILEINFO_MIME);
                                $p["data"] = fread($fp, $size);
                                $p["type"] = $finfo->buffer($p["data"], FILEINFO_MIME_TYPE);
                            }
                        }
                    }
                }
                $output = apiAddLabPicture($lab, $p);
            } else {
                $output["code"] = 400;
                $output["status"] = "fail";
                $output["message"] = $GLOBALS["messages"][60027];
            }
            $app->response->setStatus($output["code"]);
            $app->response->setBody(json_encode($output));
            unlockFile(BASE_LAB . $lab_file);
            $db = NULL;
            $html5_db = NULL;
        }
    }
});
$app->delete("/api/labs/close", function () use ($app, $db) {
    list($user, $tenant, $output) = apiAuthorization($db, $app->getCookie("unetlab_session"));
    if ($user === false) {
        $app->response->setStatus($output["code"]);
        $app->response->setBody(json_encode($output));
    } else if ($tenant < 0) {
        $output["code"] = 400;
        $output["status"] = "fail";
        $output["message"] = $GLOBALS["messages"][60052];
        $app->response->setStatus($output["code"]);
        $app->response->setBody(json_encode($output));
    } else {
        $rc0 = apiSpy($db, $user["tenant"], NULL);
        if ((int) $user["sticky"] != 1) {
            $rc = updatePodLab($db, $user["tenant"], NULL);
        } else {
            $rc = 0;
        }
        if ($rc !== 0 || $rc0 !== 0) {
            $output["code"] = 500;
            $output["status"] = "error";
            $output["message"] = $GLOBALS["messages"][$rc];
        } else {
            $output["code"] = 200;
            $output["status"] = "success";
            $output["message"] = $GLOBALS["messages"][60053];
        }
        $app->response->setStatus($output["code"]);
        $app->response->setBody(json_encode($output));
        $db = NULL;
        $html5_db = NULL;
    }
});
$app->delete("/api/labs/(:path+)", function ($path = []) use ($app, $db) {
    list($user, $tenant, $output) = apiAuthorization($db, $app->getCookie("unetlab_session"));
    if ($user === false) {
        $app->response->setStatus($output["code"]);
        $app->response->setBody(json_encode($output));
    } else if (!$user["role"][["admin" => true, "editor" => true]]) {
        $app->response->setStatus($GLOBALS["forbidden"]["code"]);
        $app->response->setBody(json_encode($GLOBALS["forbidden"]));
    } else {
        $event = json_decode($app->request()->getBody());
        $s = preg_replace("/\\.\\.*/", ".", rawurldecode("/" . implode("/", $path)));
        $patterns[0] = "/(.+).unl.*\$/";
        $replacements[0] = "\$1.unl";
        $patterns[1] = "/.+\\/([0-9]+)\\/*.*\$/";
        $replacements[1] = "\$1";
        $lab_file = preg_replace($patterns[0], $replacements[0], $s);
        $id = preg_replace($patterns[1], $replacements[1], $s);
        if (!is_file(BASE_LAB . $lab_file)) {
            $output["code"] = 404;
            $output["status"] = "fail";
            $output["message"] = $GLOBALS["messages"][60000];
            $app->response->setStatus($output["code"]);
            $app->response->setBody(json_encode($output));
        } else {
            try {
                $lab = new Lab(BASE_LAB . $lab_file, $tenant);
            } catch (Exception $e) {
                if (preg_match("/^\\/[A-Za-z0-9_+\\/\\s\\-@\\.]+\\.unl\$/", $s)) {
                    if (unlink(BASE_LAB . $lab_file)) {
                        $output["code"] = 200;
                        $output["status"] = "success";
                    } else {
                        $output["code"] = 400;
                        $output["status"] = "fail";
                        $output["message"] = $GLOBALS["messages"][60021];
                    }
                } else {
                    $output["code"] = 400;
                    $output["status"] = "fail";
                    $output["message"] = $GLOBALS["messages"][$e->getMessage()];
                }
                $app->response->setStatus($output["code"]);
                $app->response->setBody(json_encode($output));
                return NULL;
            }
            if (preg_match("/^\\/[A-Za-z0-9_+\\/\\s\\-@\\.]+\\.unl\\/networks\\/[0-9]+\$/", $s)) {
                $output = apiDeleteLabNetwork($lab, $id, $tenant);
            } else if (preg_match("/^\\/[A-Za-z0-9_+\\/\\s\\-@\\.]+\\.unl\\/nodes\\/[0-9]+\$/", $s)) {
                $output = apiDeleteLabNode($lab, $id, $tenant);
            } else if (preg_match("/^\\/[A-Za-z0-9_+\\/\\s\\-@\\.]+\\.unl\\/textobjects\\/[0-9]+\$/", $s)) {
                $output = apiDeleteLabTextObject($lab, $id);
            } else if (preg_match("/^\\/[A-Za-z0-9_+\\/\\s\\-@\\.]+\\.unl\\/task\\/[0-9]+\$/", $s)) {
                $output = apiDeleteLabTask($lab, $id);
            } else if (preg_match("/^\\/[A-Za-z0-9_+\\/\\s\\-@\\.]+\\.unl\\/lineobjects\\/[0-9]+\$/", $s)) {
                $output = apiDeleteLabLineObject($lab, $id);
            } else if (preg_match("/^\\/[A-Za-z0-9_+\\/\\s\\-@\\.]+\\.unl\\/configsets\\/[0-9]+\$/", $s)) {
                $output = apiDeleteLabConfigSet($lab, $id);
            } else if (preg_match("/^\\/[A-Za-z0-9_+\\/\\s\\-@\\.]+\\.unl\\/pictures\\/[0-9]+\$/", $s)) {
                $output = apiDeleteLabPicture($lab, $id);
            } else if (preg_match("/^\\/[A-Za-z0-9_+\\/\\s\\-@\\.]+\\.unl\$/", $s)) {
                $output = apiDeleteLab($db, $lab);
            } else {
                $output["code"] = 400;
                $output["status"] = "fail";
                $output["message"] = $GLOBALS["messages"][60027];
            }
            $app->response->setStatus($output["code"]);
            $app->response->setBody(json_encode($output));
            $db = NULL;
            $html5_db = NULL;
        }
    }
});
$app->get("/api/users/(:uuser)", function ($uuser = false) use ($app, $db) {
    list($user, $tenant, $output) = apiAuthorization($db, $app->getCookie("unetlab_session"));
    if ($user === false) {
        $app->response->setStatus($output["code"]);
        $app->response->setBody(json_encode($output));
    } else if (!$user["role"][["admin" => true]] && false) {
        $app->response->setStatus($GLOBALS["forbidden"]["code"]);
        $app->response->setBody(json_encode($GLOBALS["forbidden"]));
    } else {
        if (empty($uuser)) {
            $output = apiGetUUsers($user, $db);
        } else {
            if (!$user["role"][["admin" => true]]) {
                $uuser = $user["username"];
            }
            $output = apiGetUUser($db, $uuser);
        }
        $app->response->setStatus($output["code"]);
        $app->response->setBody(json_encode($output));
        $db = NULL;
        $html5_db = NULL;
    }
});
$app->get("/api/usernames", function () use ($app, $db) {
    list($user, $tenant, $output) = apiAuthorization($db, $app->getCookie("unetlab_session"));
    if ($user === false) {
        $app->response->setStatus($output["code"]);
        $app->response->setBody(json_encode($output));
    } else {
        $output = apiGetUUsernames($user, $db);
        $app->response->setStatus($output["code"]);
        $app->response->setBody(json_encode($output));
        $db = NULL;
        $html5_db = NULL;
    }
});
$app->put("/api/users/(:uuser)", function ($uuser = false) use ($app, $db) {
    list($user, $tenant, $output) = apiAuthorization($db, $app->getCookie("unetlab_session"));
    if ($user === false) {
        $app->response->setStatus($output["code"]);
        $app->response->setBody(json_encode($output));
    } else if (!$user["role"][["admin" => true]]) {
        $app->response->setStatus($GLOBALS["forbidden"]["code"]);
        $app->response->setBody(json_encode($GLOBALS["forbidden"]));
    } else {
        $event = json_decode($app->request()->getBody());
        $p = json_decode(json_encode($event), true);
        if ($user["role"] == "editor") {
            unset($p["role"]);
            unset($p["expiration"]);
            unset($p["pod"]);
            unset($p["pexpiration"]);
        }
        $output = apiEditUUser($db, $uuser, $p);
        $app->response->setStatus($output["code"]);
        $app->response->setBody(json_encode($output));
        $db = NULL;
        $html5_db = NULL;
    }
});
$app->post("/api/users", function ($uuser = false) use ($app, $db) {
    list($user, $tenant, $output) = apiAuthorization($db, $app->getCookie("unetlab_session"));
    if ($user === false) {
        $app->response->setStatus($output["code"]);
        $app->response->setBody(json_encode($output));
    } else if (!$user["role"][["admin" => true]]) {
        $app->response->setStatus($GLOBALS["forbidden"]["code"]);
        $app->response->setBody(json_encode($GLOBALS["forbidden"]));
    } else {
        $event = json_decode($app->request()->getBody());
        $p = json_decode(json_encode($event), true);
        $output = apiAddUUser($db, $p);
        $app->response->setStatus($output["code"]);
        $app->response->setBody(json_encode($output));
        $db = NULL;
        $html5_db = NULL;
    }
});
$app->delete("/api/users/(:uuser)", function ($uuser = false) use ($app, $db) {
    list($user, $tenant, $output) = apiAuthorization($db, $app->getCookie("unetlab_session"));
    if ($user === false) {
        $app->response->setStatus($output["code"]);
        $app->response->setBody(json_encode($output));
    } else if (!$user["role"][["admin" => true]]) {
        $app->response->setStatus($GLOBALS["forbidden"]["code"]);
        $app->response->setBody(json_encode($GLOBALS["forbidden"]));
    } else {
        $output = apiDeleteUUser($db, $uuser);
        $app->response->setStatus($output["code"]);
        $app->response->setBody(json_encode($output));
        $db = NULL;
        $html5_db = NULL;
    }
});
$app->post("/api/users/kick/(:uuser)", function ($uuser = false) use ($app, $db) {
    list($user, $tenant, $output) = apiAuthorization($db, $app->getCookie("unetlab_session"));
    if ($user === false) {
        $app->response->setStatus($output["code"]);
        $app->response->setBody(json_encode($output));
    } else if (!$user["role"][["admin" => true]]) {
        $app->response->setStatus($GLOBALS["forbidden"]["code"]);
        $app->response->setBody(json_encode($GLOBALS["forbidden"]));
    } else {
        $output = apiKickUUser($db, $uuser);
        $app->response->setStatus($output["code"]);
        $app->response->setBody(json_encode($output));
        $db = NULL;
        $html5_db = NULL;
    }
});
$app->post("/api/cluster", function () use ($app, $db) {
    list($user, $tenant, $output) = apiAuthorization($db, $app->getCookie("unetlab_session"));
    if ($user === false) {
        $app->response->setStatus($output["code"]);
        $app->response->setBody(json_encode($output));
    } else if (!$user["role"][["admin" => true]]) {
        $app->response->setStatus($GLOBALS["forbidden"]["code"]);
        $app->response->setBody(json_encode($GLOBALS["forbidden"]));
    } else {
        $event = json_decode($app->request()->getBody());
        $p = json_decode(json_encode($event), true);
        $output = addClusterMember($db, $p);
        $app->response->setStatus($output["code"]);
        $app->response->setBody(json_encode($output));
        $db = NULL;
        $html5_db = NULL;
    }
});
$app->get("/api/cluster", function () use ($app, $db) {
    list($user, $tenant, $output) = apiAuthorization($db, $app->getCookie("unetlab_session"));
    if ($user === false) {
        $app->response->setStatus($output["code"]);
        $app->response->setBody(json_encode($output));
    } else {
        $output = getClusterMembers($db);
        $app->response->setStatus($output["code"]);
        $app->response->setBody(json_encode($output));
        $db = NULL;
        $html5_db = NULL;
    }
});
$app->get("/api/stopcluster/(:satid)", function ($satid = false) use ($app, $db) {
    list($user, $tenant, $output) = apiAuthorization($db, $app->getCookie("unetlab_session"));
    if ($user === false) {
        $output["code"] = 400;
        $output["data"]["reason"] = "Unauthorized";
        $app->response->setStatus($output["code"]);
        $app->response->setBody(json_encode($output));
    } else if (!$user["role"][["admin" => true]]) {
        $output["code"] = 400;
        $output["data"]["reason"] = "Unauthorized";
        $app->response->setStatus($GLOBALS["forbidden"]["code"]);
        $app->response->setBody(json_encode($GLOBALS["forbidden"]));
    } else {
        if ($satid && $satid != 0) {
            $output["code"] = 200;
            $output["data"]["reason"] = "Order sent";
            shell_exec("sudo /opt/unetlab/wrappers/unl_wrapper -a stopsat -I " . $satid);
            $app->response->setStatus($output["code"]);
            $app->response->setBody(json_encode($output));
        } else {
            $output["code"] = 400;
            $output["data"]["reason"] = "Invalid Sat";
            $app->response->setStatus($output["code"]);
            $app->response->setBody(json_encode($output));
        }
        $app->response->setStatus($output["code"]);
        $app->response->setBody(json_encode($output));
        $db = NULL;
    }
});
$app->get("/api/resetcluster/(:satid)", function ($satid = false) use ($app, $db) {
    list($user, $tenant, $output) = apiAuthorization($db, $app->getCookie("unetlab_session"));
    if ($user === false) {
        $output["code"] = 400;
        $output["data"]["reason"] = "Unauthorized";
        $app->response->setStatus($output["code"]);
        $app->response->setBody(json_encode($output));
    } else if (!$user["role"][["admin" => true]]) {
        $output["code"] = 400;
        $output["data"]["reason"] = "Unauthorized";
        $app->response->setStatus($GLOBALS["forbidden"]["code"]);
        $app->response->setBody(json_encode($GLOBALS["forbidden"]));
    } else {
        if ($satid && $satid != 0) {
            $output["code"] = 200;
            $output["data"]["reason"] = "Order sent";
            shell_exec("sudo /opt/unetlab/wrappers/unl_wrapper -a resetsat -I " . $satid);
            $app->response->setStatus($output["code"]);
            $app->response->setBody(json_encode($output));
        } else {
            $output["code"] = 400;
            $output["data"]["reason"] = "Invalid Sat";
            $app->response->setStatus($output["code"]);
            $app->response->setBody(json_encode($output));
        }
        $app->response->setStatus($output["code"]);
        $app->response->setBody(json_encode($output));
        $db = NULL;
    }
});
$app->get("/api/purgecluster/(:satid)", function ($satid = false) use ($app, $db) {
    list($user, $tenant, $output) = apiAuthorization($db, $app->getCookie("unetlab_session"));
    if ($user === false) {
        $output["code"] = 400;
        $output["data"]["reason"] = "Unauthorized";
        $app->response->setStatus($output["code"]);
        $app->response->setBody(json_encode($output));
    } else if (!$user["role"][["admin" => true]]) {
        $output["code"] = 400;
        $output["data"]["reason"] = "Unauthorized";
        $app->response->setStatus($GLOBALS["forbidden"]["code"]);
        $app->response->setBody(json_encode($GLOBALS["forbidden"]));
    } else {
        if ($satid && $satid != 0) {
            $output["code"] = 200;
            $output["data"]["reason"] = "Order sent";
            $query = "update console set status = 'stopped' where sat = " . $satid . ";";
            $statement = $db->prepare($query);
            $statement->execute();
            shell_exec("sudo /opt/unetlab/wrappers/unl_wrapper -a clearstopped");
            $query = "delete from disk_usage where sat = " . $satid . ";";
            $statement = $db->prepare($query);
            $statement->execute();
            $app->response->setStatus($output["code"]);
            $app->response->setBody(json_encode($output));
        } else {
            $output["code"] = 400;
            $output["data"]["reason"] = "Invalid Sat";
            $app->response->setStatus($output["code"]);
            $app->response->setBody(json_encode($output));
        }
        $app->response->setStatus($output["code"]);
        $app->response->setBody(json_encode($output));
        $db = NULL;
    }
});
$app->get("/api/clusterfull", function () use ($app, $db) {
    list($user, $tenant, $output) = apiAuthorization($db, $app->getCookie("unetlab_session"));
    if ($user === false) {
        $app->response->setStatus($output["code"]);
        $app->response->setBody(json_encode($output));
    } else {
        $output = getClusterFull($user, $db);
        $app->response->setStatus($output["code"]);
        $app->response->setBody(json_encode($output));
        $db = NULL;
        $html5_db = NULL;
    }
});
$app->get("/api/clusterfullnd", function () use ($app, $db) {
    list($user, $tenant, $output) = apiAuthorization($db, $app->getCookie("unetlab_session"));
    if ($user === false) {
        $app->response->setStatus($output["code"]);
        $app->response->setBody(json_encode($output));
    } else {
        $output = getClusterFull($user, $db, 0);
        $app->response->setStatus($output["code"]);
        $app->response->setBody(json_encode($output));
        $db = NULL;
        $html5_db = NULL;
    }
});
$app->delete("/api/cluster/(:satid)", function ($satid = false) use ($app, $db) {
    list($user, $tenant, $output) = apiAuthorization($db, $app->getCookie("unetlab_session"));
    if ($user === false) {
        $app->response->setStatus($output["code"]);
        $app->response->setBody(json_encode($output));
    } else if (!$user["role"][["admin" => true]]) {
        $app->response->setStatus($GLOBALS["forbidden"]["code"]);
        $app->response->setBody(json_encode($GLOBALS["forbidden"]));
    } else {
        if ($satid) {
            $output = delClusterMember($db, $satid);
            $app->response->setStatus($output["code"]);
            $app->response->setBody(json_encode($output));
        } else {
            $app->response->setStatus($GLOBALS["forbidden"]["code"]);
            $app->response->setBody(json_encode($GLOBALS["forbidden"]));
        }
        $db = NULL;
        $html5_db = NULL;
    }
});
$app->post("/api/cpulimit", function () use ($app, $db) {
    list($user, $tenant, $output) = apiAuthorization($db, $app->getCookie("unetlab_session"));
    if ($user === false) {
        $app->response->setStatus($output["code"]);
        $app->response->setBody(json_encode($output));
    } else if (!$user["role"][["admin" => true]]) {
        $app->response->setStatus($GLOBALS["forbidden"]["code"]);
        $app->response->setBody(json_encode($GLOBALS["forbidden"]));
    } else {
        $event = json_decode($app->request()->getBody());
        $p = json_decode(json_encode($event), true);
        $output = apiSetCpuLimit($p);
        $app->response->setStatus($output["code"]);
        $app->response->setBody(json_encode($output));
        $db = NULL;
        $html5_db = NULL;
    }
});
$app->post("/api/uksm", function () use ($app, $db) {
    list($user, $tenant, $output) = apiAuthorization($db, $app->getCookie("unetlab_session"));
    if ($user === false) {
        $app->response->setStatus($output["code"]);
        $app->response->setBody(json_encode($output));
    } else if (!$user["role"][["admin" => true]]) {
        $app->response->setStatus($GLOBALS["forbidden"]["code"]);
        $app->response->setBody(json_encode($GLOBALS["forbidden"]));
    } else {
        $event = json_decode($app->request()->getBody());
        $p = json_decode(json_encode($event), true);
        $output = apiSetUksm($p);
        $app->response->setStatus($output["code"]);
        $app->response->setBody(json_encode($output));
        $db = NULL;
        $html5_db = NULL;
    }
});
$app->post("/api/ksm", function () use ($app, $db) {
    list($user, $tenant, $output) = apiAuthorization($db, $app->getCookie("unetlab_session"));
    if ($user === false) {
        $app->response->setStatus($output["code"]);
        $app->response->setBody(json_encode($output));
    } else if (!$user["role"][["admin" => true]]) {
        $app->response->setStatus($GLOBALS["forbidden"]["code"]);
        $app->response->setBody(json_encode($GLOBALS["forbidden"]));
    } else {
        $event = json_decode($app->request()->getBody());
        $p = json_decode(json_encode($event), true);
        $output = apiSetKsm($p);
        $app->response->setStatus($output["code"]);
        $app->response->setBody(json_encode($output));
        $db = NULL;
        $html5_db = NULL;
    }
});
$app->post("/api/export", function () use ($app, $db) {
    list($user, $tenant, $output) = apiAuthorization($db, $app->getCookie("unetlab_session"));
    if ($user === false) {
        $app->response->setStatus($output["code"]);
        $app->response->setBody(json_encode($output));
    } else if (!$user["role"][["admin" => true, "editor" => true]]) {
        $app->response->setStatus($GLOBALS["forbidden"]["code"]);
        $app->response->setBody(json_encode($GLOBALS["forbidden"]));
    } else {
        $event = json_decode($app->request()->getBody());
        $p = json_decode(json_encode($event), true);
        $output = apiExportLabs($p);
        $app->response->setStatus($output["code"]);
        $app->response->setBody(json_encode($output));
        $db = NULL;
        $html5_db = NULL;
    }
});
$app->post("/api/import", function () use ($app, $db) {
    list($user, $tenant, $output) = apiAuthorization($db, $app->getCookie("unetlab_session"));
    if ($user === false) {
        $app->response->setStatus($output["code"]);
        $app->response->setBody(json_encode($output));
    } else if (!$user["role"][["admin" => true, "editor" => true]]) {
        $app->response->setStatus($GLOBALS["forbidden"]["code"]);
        $app->response->setBody(json_encode($GLOBALS["forbidden"]));
    } else {
        $p = $_POST;
        if (!empty($_FILES)) {
            foreach ($_FILES as $file) {
                $p["name"] = $file["name"];
                $p["file"] = $file["tmp_name"];
                $p["error"] = $file["name"];
            }
        }
        $output = apiImportLabs($p);
        $app->response->setStatus($output["code"]);
        $app->response->setBody(json_encode($output));
        $db = NULL;
        $html5_db = NULL;
    }
});
$app->get("/api/update", function () use ($app, $db) {
    list($user, $tenant, $output) = apiAuthorization($db, $app->getCookie("unetlab_session"));
    if ($user === false) {
        $app->response->setStatus($output["code"]);
        $app->response->setBody(json_encode($output));
    } else if (!$user["role"][["admin" => true]]) {
        $app->response->setStatus($GLOBALS["forbidden"]["code"]);
        $app->response->setBody(json_encode($GLOBALS["forbidden"]));
    } else {
        $cmd = "sudo /opt/unetlab/wrappers/unl_wrapper -a update";
        exec($cmd, $o, $rc);
        if ($rc != 0) {
            error_log(date("M d H:i:s ") . "ERROR: " . $GLOBALS["messages"][60059]);
            $output["code"] = 400;
            $output["status"] = "fail";
            $output["message"] = $GLOBALS["messages"][60059];
        } else {
            $output["code"] = 200;
            $output["status"] = "success";
            $output["message"] = $GLOBALS["messages"][60060];
        }
        $app->response->setStatus($output["code"]);
        $app->response->setBody(json_encode($output));
        $db = NULL;
        $html5_db = NULL;
    }
});
$app->get("/api/logs/(:file)/(:lines)/(:search)", function ($file = false, $lines = 10, $search = "") use ($app, $db) {
    list($user, $tenant, $output) = apiAuthorization($db, $app->getCookie("unetlab_session"));
    if ($user === false) {
        $app->response->setStatus($output["code"]);
        $app->response->setBody(json_encode($output));
    } else {
        if ($file == "local units") {
            $f = shell_exec("journalctl  -n " . $lines . " -u eveng* --no-pager");
        } else if ($file == "license service") {
            $f = shell_exec("journalctl  -n " . $lines . " -u licserver --no-pager");
        } else if ($file == "process-scanner") {
            $f = shell_exec("journalctl  -n " . $lines . " -u process-scanner --no-pager");
        } else {
            $f = @file_get_contents("/opt/unetlab/data/Logs/" . $file);
        }
        if ($f) {
            $arr = explode("\n", $f);
            if (!is_array($arr)) {
                $arr = [];
            }
            $arr = array_reverse($arr);
            if ($search) {
                foreach ($arr as $k => $v) {
                    if (strstr($v, $search) === false) {
                        unset($arr[$k]);
                    }
                }
            }
            $arr = array_slice($arr, 0, $lines);
        } else {
            $arr = [];
        }
        $app->response->setStatus(200);
        $app->response->setBody(json_encode($arr));
        $db = NULL;
        $html5_db = NULL;
    }
});
$app->get("/api/icons", function () use ($app, $db) {
    $arr = listNodeIcons();
    $app->response->setStatus(200);
    $app->response->setBody(json_encode($arr));
    $db = NULL;
    $html5_db = NULL;
});
$app->get("/api/sharedlabs/(:id)", function ($id = false) use ($app, $db) {
    list($user, $tenant, $output) = apiAuthorization($db, $app->getCookie("unetlab_session"));
    if ($user === false) {
        $app->response->setStatus($output["code"]);
        $app->response->setBody(json_encode($output));
    } else if (!$user["role"][["admin" => true]]) {
        $app->response->setStatus($GLOBALS["forbidden"]["code"]);
        $app->response->setBody(json_encode($GLOBALS["forbidden"]));
    } else {
        $output = apiGetSharedLabs($id);
        $app->response->setStatus(200);
        $app->response->setBody(json_encode($output));
    }
});
$app->run();

?>
