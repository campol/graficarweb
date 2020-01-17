/**
 * 
 */
package com.maestria.sistinfoweb.tarea1.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

/**
 * @author lcampo
 *
 */
@Controller
public class HomeController {
	@RequestMapping("/")
    public String viewHome() {
        return "index";
    }
}
