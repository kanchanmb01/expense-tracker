package com.example.demo.config;

import java.io.IOException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.JwtException;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;

@Component
@Slf4j
public class JwtFilter extends OncePerRequestFilter{
	
	@Autowired 
	private JwtUtil jwtUtil;
	
    @Autowired 
    private CustomUserDetailsService userDetailsService;
   
    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain)
            throws ServletException, IOException {

        String path = request.getRequestURI();
        log.info("JWT validation started for request {}",path);
        
        if (path.startsWith("/api/auth")) {
            filterChain.doFilter(request, response);
            return;
        }

        String authHeader = request.getHeader("Authorization");
        String token = null;
        String username = null;
        
        //Client sends JWT in request header.
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            token = authHeader.substring(7);
            
            try {
                username = jwtUtil.extractUsername(token);
            } catch (ExpiredJwtException e) {
                // Handle expired token
            	 	log.error("Expired JWT token received for URI {}", request.getRequestURI());
                response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                response.setContentType("application/json");
                response.getWriter().write("{\"error\":\"Token expired. Please login again.\"}");
                return; // stop filter chain
            } catch (JwtException e) {
            		log.error("Invalid JWT token received for URI {}",request.getRequestURI());
                response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                response.setContentType("application/json");
                response.getWriter().write("{\"error\":\"Invalid token.\"}");
                return;
            }
        }

        if (username != null && SecurityContextHolder.getContext().getAuthentication() == null) {
           
        		//Spring security sets authentication
        		UserDetails userDetails = userDetailsService.loadUserByUsername(username);
            
            if (jwtUtil.validateToken(token,userDetails)) {
            		
            		//A Spring Security authentication object.It represents authenticated user.
                var authToken =
                        new UsernamePasswordAuthenticationToken(
                                userDetails, null, userDetails.getAuthorities());
                
    
                /*WebAuthenticationDetailsSource attaches web request-specific information such as client IP address and 
                 * session information to the Authentication object(request specific metadata) thus provides additional security 
                 * and auditing information. 
                 */
                
                authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                
                //spring security checks the context and authentication is set.
                SecurityContextHolder.getContext().setAuthentication(authToken);
                
                log.info("User {} authenticated via JWT",username);
            }
        }
        
        //Passes control to next filter and eventually to controller.
        filterChain.doFilter(request, response);
    }

}
